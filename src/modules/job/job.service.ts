import { Injectable, NotFoundException } from '@nestjs/common';

import {
  CompanyRepository,
  IUser,
  JobCategoryRepository,
  JobRepository,
  JobStatus,
} from 'src/common';
import { ChangeStatus, CreateJobDto, SearchDto, UpdateJobDto } from './dto';

@Injectable()
export class JobService {
  constructor(
    private readonly companyRepo: CompanyRepository,
    private readonly jobRepo: JobRepository,
    private readonly jobCatRepo: JobCategoryRepository,
  ) {}
  createJob = async (user: IUser, data: CreateJobDto) => {
    const company = await this.companyRepo.findOne({ adminId: user.id });
    if (!company) throw new NotFoundException('company not found');
    const category = await this.jobCatRepo.findById(data.categoryId);
    if (!category) throw new NotFoundException('category not found');
    const jobCreated = await this.jobRepo.transaction(async (tx) => {
      const skillIds = data.skills.map((s) => s.skillId);
      const skillRecords = await tx.skill.findMany({
        where: { id: { in: skillIds } },
      });
      if (skillRecords.length !== skillIds.length)
        throw new NotFoundException('Some skills not found');
      const job = await tx.job.create({
        data: {
          position: data.position,
          description: data.description,
          type: data.type,
          location: data.location,
          company: { connect: { id: company.id } },
          category: { connect: { id: data.categoryId } },
        },
      });
      await tx.jobSkill.createMany({
        data: data.skills.map((s, i) => ({
          jobId: job.id,
          skillId: s.skillId,
          level: s.level,
        })),
      });
      const jobWithSkills = await tx.job.findUnique({
        where: { id: job.id },
        include: { skills: true },
      });
      return jobWithSkills;
    });
    return { message: 'job posted ', data: jobCreated };
  };
  updateJob = async (user: IUser, jobId: number, Dto: UpdateJobDto) => {
    const company = await this.companyRepo.findOne({ adminId: user.id });
    if (!company) throw new NotFoundException('company not found');
    const job = await this.jobRepo.findOne({
      id: jobId,
      companyId: company.id,
    });
    if (!job) throw new NotFoundException('job not found');
    const updatedJob = await this.jobRepo.transaction(async (tx) => {
      if (Dto.skills) {
        const skillIds = Dto.skills.map((s) => s.skillId);

        const skillRecords = await tx.skill.findMany({
          where: { id: { in: skillIds } },
        });

        if (skillRecords.length !== skillIds.length)
          throw new NotFoundException('Some skills not found');

        await tx.jobSkill.createMany({
          data: Dto.skills.map((s) => ({
            jobId: jobId,
            skillId: s.skillId,
            level: s.level,
          })),
          skipDuplicates: true,
        });
      }

      if (Dto.removedSkills) {
        await tx.jobSkill.deleteMany({
          where: {
            skillId: { in: Dto.removedSkills },
            jobId: jobId,
          },
        });
      }
      const updateData: any = { ...Dto };
      if (Dto.categoryId) {
        const category = await tx.jobCategory.findUnique({
          where: { id: Dto.categoryId },
        });
        if (!category) throw new NotFoundException('category not found');
        updateData.category = { connect: { id: Dto.categoryId } };
        delete updateData.categoryId;
      }
      delete updateData.skills;
      delete updateData.removedSkills;
      const job = await tx.job.update({
        where: { id: jobId },
        data: updateData,
        include: { skills: true },
      });

      return job;
    });
    return {
      message: 'job updated successfully',
      data: updatedJob,
    };
  };
  changeJobStatus = async (
    user: IUser,
    jobId: number,
    status: ChangeStatus,
  ) => {
    const company = await this.companyRepo.findOne({ adminId: user.id });
    if (!company) throw new NotFoundException('company not found');
    const job = await this.jobRepo.findOne({
      id: jobId,
      companyId: company.id,
    });
    if (!job) throw new NotFoundException('job not found');
    const updated = await this.jobRepo.update(
      {
        id: jobId,
        companyId: company.id,
      },
      { status: status.status },
    );
    return { message: 'job status updated', data: updated };
  };

  getJobDetails = async (jobId: number) => {
    const job = await this.jobRepo.findById(jobId, {
      include: {
        skills: true,
      },
    });
    if (!job) throw new NotFoundException('job not found');
    return { message: 'job Details', data: job };
  };
  searchJobs = async (filter: SearchDto, limit: number, page: number) => {
    const offset = (page - 1) * limit;
    const where: any = {
      status: JobStatus.open,
      ...(filter.location && { location: filter.location }),
      ...(filter.type && { type: filter.type }),
      ...(filter.search && {
        OR: [
          { position: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      }),
      ...(filter.skills && {
        skills: { some: { skillId: { in: filter.skills } } },
      }),
    };
    const [jobs, total] = await Promise.all([
      this.jobRepo.findAll({
        where: where,
        skip: offset,
        take: limit,
      }),
      this.jobRepo.count({ where }),
    ]);
    if (!jobs.length) return { message: 'no jobs found ' };
    return {
      message: 'jobs found',
      data: jobs,
      meta: { total, pages: Math.ceil(total / limit) },
    };
  };
  AllJobs = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      this.jobRepo.findAll({
        where: { status: JobStatus.open },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.jobRepo.count({
        where: { status: JobStatus.open },
      }),
    ]);
    if (!jobs.length) return { message: 'no jobs found ' };
    return {
      message: 'jobs found',
      data: jobs,
      meta: { total, pages: Math.ceil(total / limit) },
    };
  };
}
