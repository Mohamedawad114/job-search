import { Injectable, NotFoundException } from '@nestjs/common';
import { JobCategoryRepository, JobRepository, JobStatus } from 'src/common';

@Injectable()
export class JobCatService {
  constructor(
    private readonly jobCatRepo: JobCategoryRepository,
    private readonly jobRepo: JobRepository,
  ) {}

  allCategories = async (page: number, limit: number) => {
    const categories = await this.jobCatRepo.findAll({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });
    const total = await this.jobCatRepo.count();
    return {
      message: 'all categories retrieved successfully',
      data: categories,
      meta: {
        total,
        pages: Math.ceil(total / limit),
      },
    };
  };
  allCategoryJobs = async (id: number, page: number, limit: number) => {
    const category = await this.jobCatRepo.findById(id);
    if (!category) throw new NotFoundException('category not found');
    const [jobs, total] = await Promise.all([
      this.jobRepo.findAll({
        where: { categoryId: id, status: JobStatus.open },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          position: true,
          description: true,
          companyId: true,
        },
      }),
      this.jobRepo.count({ where: { categoryId: id } }),
    ]);
    if (jobs.length === 0) return { message: 'no jobs for this category yet' };
    return {
      message: 'jobs retrieved successfully',
      data: jobs,
      meta: {
        total,
        pages: Math.ceil(total / limit),
      },
    };
  };
}
