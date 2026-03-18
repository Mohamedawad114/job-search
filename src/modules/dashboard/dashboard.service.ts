import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IUser,
  JobCategoryRepository,
  SkillRepository,
  TypeSearch,
  WorkTypeRepository,
} from 'src/common';
import {
  redis,
  redisKeys,
} from 'src/common/Utils/services/index';
import {
  CreateJobCatDto,
  CreateSkillDto,
  CreateWorkTypeDto,
  DataFilterDto,
  UpdateJobCat,
} from './Dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly skillRepo: SkillRepository,
    private readonly jobCategoryRepo: JobCategoryRepository,
    private readonly workTypeRepo: WorkTypeRepository,
  ) {}

  addSkills = async (user: IUser, data: CreateSkillDto) => {
    if (await this.skillRepo.findOne({ skill: data.skill }))
      throw new ConflictException('skill already exists');
    const skill = await this.skillRepo.create({ ...data });
    if (!skill) throw new BadRequestException('something wrong');
    const stream = redis.scanStream({
      match: redisKeys.dataForAdmin('*', '*', TypeSearch.skills),
    });
    stream.on('data', (keys: string[]) => {
      if (keys.length) redis.del(keys);
    });
    return {
      message: 'skill is added',
      data: skill,
    };
  };
  deleteSkill = async (skillId: number) => {
    const skill = await this.skillRepo.findById(skillId);
    if (!skill) throw new NotFoundException('skill not found');
    await this.skillRepo.delete({ id: skillId });
    const stream = redis.scanStream({
      match: redisKeys.dataForAdmin('*', '*', TypeSearch.skills),
    });
    stream.on('data', (keys: string[]) => {
      if (keys.length) redis.del(keys);
    });
    return { message: 'skill deleted' };
  };

  addJobCat = async (data: CreateJobCatDto) => {
    if (await this.jobCategoryRepo.findOne({ name: data.name }))
      throw new ConflictException('job category already exists');
    const jobCat = await this.jobCategoryRepo.create({ ...data });
    if (!jobCat) throw new BadRequestException('something wrong');
    const stream = redis.scanStream({
      match: redisKeys.dataForAdmin('*', '*', TypeSearch.jobCategory),
    });
    stream.on('data', (keys: string[]) => {
      if (keys.length) redis.del(keys);
    });
    return {
      message: 'job category is added',
      data: jobCat,
    };
  };
  updateJobCat = async (data: UpdateJobCat, jobCatId: number) => {
    const jobCat = await this.jobCategoryRepo.findById(jobCatId);
    if (!jobCat) throw new NotFoundException('job category not found');
    const jobCatUpdated = await this.jobCategoryRepo.updateById(jobCatId, {
      ...data,
    });
    if (!jobCatUpdated) throw new BadRequestException('something wrong');
    return {
      message: 'job category is updated',
      data: jobCatUpdated,
    };
  };
  deleteJobCat = async (jobCatId: number) => {
    const jobCat = await this.jobCategoryRepo.findById(jobCatId);
    if (!jobCat) throw new NotFoundException('job category not found');
    await this.jobCategoryRepo.delete({ id: jobCatId });
    const stream = redis.scanStream({
      match: redisKeys.dataForAdmin('*', '*', TypeSearch.jobCategory),
    });
    stream.on('data', (keys: string[]) => {
      if (keys.length) redis.del(keys);
    });
    return { message: 'job  category deleted' };
  };

  addWorkType = async (user: IUser, data: CreateWorkTypeDto) => {
    if (await this.workTypeRepo.findOne({ name: data.name }))
      throw new ConflictException('work type already exists');
    const workType = await this.workTypeRepo.create({ ...data });
    if (!workType) throw new BadRequestException('something wrong');
    const stream = redis.scanStream({
      match: redisKeys.dataForAdmin('*', '*', TypeSearch.workType),
    });
    stream.on('data', (keys: string[]) => {
      if (keys.length) redis.del(keys);
    });
    return {
      message: 'workType is added',
      data: workType,
    };
  };
  deleteWorkType = async (workTypeId: number) => {
    const workType = await this.workTypeRepo.findById(workTypeId);
    if (!workType) throw new NotFoundException('workType not found');
    await this.workTypeRepo.delete({ id: workTypeId });
    const stream = redis.scanStream({
      match: redisKeys.dataForAdmin('*', '*', TypeSearch.workType),
    });
    stream.on('data', (keys: string[]) => {
      if (keys.length) redis.del(keys);
    });
    return { message: 'workType deleted' };
  };

  finds = async (page: number, limit: number, Dto: DataFilterDto) => {
    const dataRedis = await redis.get(
      redisKeys.dataForAdmin(page, limit, Dto.dataType),
    );
    if (dataRedis)
      return { data: JSON.parse(dataRedis), message: 'data from cache' };
    const offset = (page - 1) * limit;
    let Repo: any;
    let message: string;
    switch (Dto.dataType) {
      case TypeSearch.skills:
        Repo = this.skillRepo;
        message = 'skills';
        break;
      case TypeSearch.jobCategory:
        Repo = this.jobCategoryRepo;
        message = 'job categories';
        break;
      case TypeSearch.workType:
        Repo = this.workTypeRepo;
        message = 'workTypes';
        break;
      default:
        throw new BadRequestException('Invalid find search');
    }
    const [data, total] = await Promise.all([
      Repo.findAll({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      await Repo.count({}),
    ]);
    await redis.set(
      redisKeys.dataForAdmin(page, limit, Dto.dataType),
      JSON.stringify(data),
      'EX',
      60 * 60,
    );
    return {
      message: message,
      data: data,
      meta: {
        dataCount: total,
        pages: Math.ceil(total / limit),
      },
    };
  };
}
