import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CompanyRepository,
  JobRepository,
  WorkTypeRepository,
} from 'src/common';

@Injectable()
export class WorkTypeService {
  constructor(
    private readonly companyRepo: CompanyRepository,
    private readonly workTypeRepo: WorkTypeRepository,
  ) {}
  workCategories = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const work_types = await this.workTypeRepo.findAll({
      take: limit,
      skip: offset,
    });
    return {
      message: 'work-types',
      data: work_types,
    };
  };
  companies_forType = async (
    workTypeId: number,
    page: number,
    limit: number,
  ) => {
    if (!workTypeId) throw new BadRequestException('workType id is required');
    const offset = (page - 1) * limit;
    const companies = await this.companyRepo.findAll({
      where: { workTypeId: workTypeId },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        logo: true,
        email: true,
        description: true,
        workType: true,
      },
    });
    return {
      message: 'work-types',
      data: companies,
    };
  };
}
