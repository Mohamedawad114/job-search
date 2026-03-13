import { Injectable, NotFoundException } from '@nestjs/common';
import { JobCategoryRepository, JobRepository } from 'src/common';

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
    const jobs = await this.jobRepo.findAll({
      where: { categoryId: id },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
      include: { skills: true },
    });
    const total = await this.jobRepo.count({ categoryId: id });
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
