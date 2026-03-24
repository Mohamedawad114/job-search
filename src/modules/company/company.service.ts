import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CompanyRepository,
  IUser,
  JobRepository,
  UserRepository,
  WorkTypeRepository,
} from 'src/common';
import { Sys_Role } from 'src/common/Enum';
import {
  MapsProducer,
  redis,
  redisKeys,
  s3_services,
} from 'src/common/Utils/services';
import {
  ChangeAdminCompany,
  CreateCompanyDto,
  UpdateCompanyDto,
  UploadDto,
} from './Dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepo: CompanyRepository,
    private readonly userRepo: UserRepository,
    private readonly s3Service: s3_services,
    private readonly workTypeRepo: WorkTypeRepository,
    private readonly mapAddress: MapsProducer,
    private readonly jobRepo: JobRepository,
  ) {}

  getCompanyProfile = async (user: IUser, companyId: number) => {
    if (!companyId) throw new BadRequestException('companyId is required');
    const company = await this.companyRepo.findById(companyId, {
      select: {
        id: true,
        name: true,
        logo: true,
        email: true,
        description: true,
        website: true,
        address: true,
        formatAddress: true,
        latitude: true,
        longitude: true,
        workType: true,
      },
    });
    if (!company) throw new NotFoundException('company not found');
    return {
      message: 'company profile',
      data: company,
    };
  };
  getAllCompanies = async (page: number, limit: number) => {
    const cached = await redis.get(redisKeys.allCompanies(page, limit));
    if (cached) {
      return { data: JSON.parse(cached) };
    }
    const offset = (page - 1) * limit;
    const companies = await this.companyRepo.findAll({
      select: {
        id: true,
        name: true,
        logo: true,
        description: true,
        workType: true,
      },
      take: limit,
      skip: offset,
    });
    if (!companies.length) throw new NotFoundException(' no companies found');
    await redis.set(
      redisKeys.allCompanies(page, limit),
      JSON.stringify(companies),
      'EX',
      60 * 60 * 12,
    );
    return {
      message: 'companies',
      data: companies,
    };
  };
  createCompanyAccount = async (Dto: CreateCompanyDto, user: IUser) => {
    const emailDuplicated = await this.companyRepo.findOne({
      email: Dto.email,
    });
    if (emailDuplicated) throw new ConflictException('email is duplicated');
    const workType = await this.workTypeRepo.findById(Dto.workTypeId);
    if (!workType) throw new NotFoundException('workType not exist');
    const { workTypeId, ...rest } = Dto;
    const data = {
      ...rest,
      admin: {
        connect: { id: user.id },
      },
      workType: {
        connect: { id: workTypeId },
      },
    };
    const created = await this.companyRepo.create(data);
    await this.mapAddress.addressToMaps(Dto.address, created.id);
    await this.userRepo.updateById(user.id, {
      role: Sys_Role.company_admin,
      company: { connect: { id: created.id } },
      ownedCompany: { connect: { id: created.id } },
    });
    const stream = redis.scanStream({
      match: redisKeys.allCompanies('*', '*'),
      count: 100,
    });
    stream.on('data', (keys) => {
      if (keys.length > 0) {
        redis.del(...keys);
      }
    });
    return {
      message: 'company account created',
      data: created,
    };
  };
  getUploadUrl = async (user: IUser) => {
    const company = await this.companyRepo.findOne({ adminId: user.id });
    if (!company)
      throw new NotFoundException(
        "no company found or you're not a company admin",
      );
    let key = `companies/${company.id}`;
    const { Key, url } = await this.s3Service.upload_file(key);
    return { message: 'upload url generated', data: { Key, url } };
  };
  updateUpload = async (Dto: UploadDto, user: IUser) => {
    const { key } = Dto;
    const company = await this.companyRepo.findOne({ adminId: user.id });
    if (!company)
      throw new NotFoundException(
        "no company found or you're not a company admin",
      );
    const { uploaded } = await this.s3Service.verifyUpload(key);
    if (!uploaded) throw new BadRequestException('file not uploaded');
    if (company.logo) await this.s3Service.deleteFile(company.logo);
    const updated = await this.companyRepo.updateById(company.id, {
      logo: key,
    });
    return {
      message: 'logo uploaded',
      data: updated,
    };
  };
  updateCompany = async (user: IUser, Dto: UpdateCompanyDto) => {
    const company = await this.companyRepo.findOne({ adminId: user.id });
    if (!company)
      throw new NotFoundException(
        "no company found or you're not a company admin",
      );
    if (Dto.email) {
      const emailDuplicated = await this.companyRepo.findOne({
        email: Dto.email,
      });
      if (emailDuplicated) throw new ConflictException('email is duplicated');
    }
    if (Dto.workTypeId) {
      const workTypeIsEXist = await this.workTypeRepo.findById(Dto.workTypeId);
      if (!workTypeIsEXist)
        throw new ConflictException('workType is not exist');
    }
    if (Dto.address)
      await this.mapAddress.addressToMaps(Dto.address, company.id);
    const data = {
      ...Dto,
      workType: Dto.workTypeId
        ? {
            connect: {
              id: Dto.workTypeId,
            },
          }
        : undefined,
    };
    const updated = await this.companyRepo.update({ adminId: user.id }, data);
    const stream = redis.scanStream({
      match: redisKeys.allCompanies('*', '*'),
      count: 100,
    });
    stream.on('data', (keys) => {
      if (keys.length > 0) {
        redis.del(...keys);
      }
    });
    return {
      message: 'company account updated',
      data: updated,
    };
  };
  changeAdmin = async (user: IUser, data: ChangeAdminCompany) => {
    const company = await this.companyRepo.findOne({ adminId: user.id });
    if (!company)
      throw new NotFoundException(
        "no company found or you're not a company admin",
      );
    const userExist = await this.userRepo.findOne({
      id: data.userId,
      isConfirmed: true,
    });
    if (!userExist) throw new NotFoundException('user not found');
    await this.companyRepo.update(
      { adminId: user.id },
      {
        admin: { connect: { id: data.userId } },
        employees: { connect: { id: data.userId } },
      },
    );
    await this.userRepo.updateById(data.userId, {
      role: Sys_Role.company_admin,
      ownedCompany: { connect: { id: company.id } },
      company: { connect: { id: company.id } },
    });
    await this.userRepo.updateById(user.id, {
      role: Sys_Role.user,
    });
    return {
      message: 'admin change',
    };
  };
  search = async (search: string, page: number, limit: number) => {
    if (!search) throw new BadRequestException('search is required');
    search = search.trim();
    const cached = await redis.get(redisKeys.allCompanies(page, limit, search));
    if (cached) {
      return { data: JSON.parse(cached) };
    }
    const offset = (page - 1) * limit;
    const companies = await this.companyRepo.findAll({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
      },
      select: {
        workType: true,
        name: true,
        email: true,
        logo: true,
        description: true,
      },
      skip: offset,
      take: limit,
    });
    await redis.set(
      redisKeys.allCompanies(page, limit, search),
      JSON.stringify(companies),
      'EX',
      60 * 60 * 12,
    );
    return {
      message: 'companies found',
      data: companies,
    };
  };
  companyJobs = async (companyId: number, page: number, limit: number) => {
    const cached = await redis.get(
      redisKeys.companyJobs(companyId, page, limit),
    );
    if (cached) {
      return { data: JSON.parse(cached) };
    }
    const company = await this.companyRepo.findById(companyId);
    if (!company) throw new NotFoundException('company not found');
    const offset = (page - 1) * limit;
    const companyJobs = await this.jobRepo.findAll({
      where: { companyId: companyId },
      orderBy: { createdAt: 'desc' },
      select: {
        id:true,
        position: true,
        description: true,
        type: true,
        location: true,
        createdAt: true,
      },
      skip: offset,
      take: limit,
    });
    if (!companyJobs.length)
      return { message: 'no jobs found no jobs found for this company' };
    await redis.set(
      redisKeys.companyJobs(companyId, page, limit),
      JSON.stringify(companyJobs),
      'EX',
      60 * 60 * 12,
    );
    return {
      message: 'jobs found',
      data: companyJobs,
    };
  };
}
