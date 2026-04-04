import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CompanyRepository,
  decoderCursor,
  encoderCursor,
  IUser,
  JobCategoryRepository,
  JobRepository,
  JobStatus,
} from 'src/common';
import {
  ChangeStatus,
  CreateJobDto,
  CreateJobGqlDto,
  SearchDto,
  UpdateJobDto,
} from './dto';
import {
  redis,
  redisKeys,
  rejectedApplicationsProducer,
} from 'src/common/Utils/services';
import { plainToInstance } from 'class-transformer';
import { JobEntity } from './entities/searchJob.entity';

@Injectable()
export class JobService {
  constructor(
    private readonly companyRepo: CompanyRepository,
    private readonly jobRepo: JobRepository,
    private readonly jobCatRepo: JobCategoryRepository,
    private readonly dbQueue: rejectedApplicationsProducer,
  ) {}
  private async invalidateJobCache(companyId: number) {
    const deletePatterns = [
      redisKeys.companyJobs(companyId, '*', '*'),
      redisKeys.allJobs('*', '*'),
    ];
    for (const pattern of deletePatterns) {
      const stream = redis.scanStream({ match: pattern, count: 100 });
      stream.on('data', (keys) => {
        if (keys.length > 0) redis.del(...keys);
      });
      stream.on('error', (err) => {
        console.error(`Cache invalidation error for pattern ${pattern}:`, err);
      });
    }
  }
  createJob = async (user: IUser, data: CreateJobDto | CreateJobGqlDto) => {
    const company = await this.companyRepo.findOne(
      { adminId: user.id },
      {
        select: { name: true, id: true },
      },
    );
    if (!company) throw new NotFoundException('company not found');
    const category = await this.jobCatRepo.findById(data.categoryId, {
      select: { id: true },
    });
    if (!category) throw new NotFoundException('category not found');
    const jobCreated = await this.jobRepo.transaction(async (tx) => {
      const skillIds = data.skills.map((s) => s.skillId);
      const skillRecords = await tx.skill.findMany({
        where: { id: { in: skillIds } },
        select: {
          id: true,
        },
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
          maxNumApplication: data.maxNumApplication,
        },
      });
      await tx.jobSkill.createMany({
        data: data.skills.map((s) => ({
          jobId: job.id,
          skillId: s.skillId,
          level: s.level,
        })),
      });
      const jobWithSkills = await tx.job.findUnique({
        where: { id: job.id },
        include: { skills: true, company: true },
      });
      return jobWithSkills as JobEntity;
    });
    if (!jobCreated) throw new BadRequestException('some thing wrong');
    await this.invalidateJobCache(company.id);
    await this.dbQueue.JobPosted(company.name, jobCreated?.position);
    return jobCreated as JobEntity;
  };
  updateJob = async (user: IUser, jobId: number, Dto: UpdateJobDto) => {
    const company = await this.companyRepo.findOne({ adminId: user.id });
    if (!company) throw new NotFoundException('company not found');
    const job = await this.jobRepo.findOneJob({
      id: jobId,
      companyId: company.id,
    });
    if (!job) throw new NotFoundException('job not found');
    const updatedJob = await this.jobRepo.transaction(async (tx) => {
      if (Dto.skills) {
        const skillIds = Dto.skills.map((s) => s.skillId);
        const skillRecords = await tx.skill.findMany({
          where: { id: { in: skillIds } },
          select: { id: true },
        });
        if (skillRecords.length !== skillIds.length)
          throw new NotFoundException('Some skills not found');
        if (Dto.removedSkills) {
          await tx.jobSkill.deleteMany({
            where: {
              id: { in: Dto.removedSkills },
              jobId: jobId,
            },
          });
        }
        await tx.jobSkill.createMany({
          data: Dto.skills.map((s) => ({
            jobId: jobId,
            skillId: s.skillId,
            level: s.level,
          })),
          skipDuplicates: true,
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
    await this.invalidateJobCache(company.id);
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
    const job = await this.jobRepo.findOne(
      {
        id: jobId,
        company: { adminId: user.id },
      },
      {
        select: {
          companyId: true,
        },
      },
    );
    if (!job) throw new NotFoundException('job not found');
    const updated = await this.jobRepo.update(
      {
        id: jobId,
      },
      { status: status.status },
    );
    await this.invalidateJobCache(job.companyId);
    return { message: 'job status updated', data: updated };
  };
  getJobDetails = async (jobId: number) => {
    const cached = await redis.get(redisKeys.jobDetails(jobId));
    if (cached) return JSON.parse(cached);
    const job = await this.jobRepo.findOne(
      { id: jobId, status: JobStatus.open },
      {
        include: {
          skills: true,
          company: true,
        },
      },
    );
    if (!job) throw new NotFoundException('job not found');
    await redis.set(
      redisKeys.jobDetails(jobId),
      JSON.stringify(job),
      'EX',
      60 * 60 * 12,
    );
    return job;
  };
  searchJobs = async (filter: SearchDto, limit: number, cursor?: string) => {
    const decodedCursor = decoderCursor(cursor);
    const cached = await redis.get(
      redisKeys.allJobs(limit, cursor, JSON.stringify(filter)),
    );
    if (cached) {
      return JSON.parse(cached);
    }
    const where: any = {
      status: JobStatus.open,
      ...(filter.location && { location: filter.location }),
      ...(filter.type && { type: filter.type }),
      ...(filter.search && {
        OR: [
          { position: { contains: filter.search } },
          { description: { contains: filter.search } },
        ],
      }),
      ...(filter.skills && {
        skills: { some: { skillId: { in: filter.skills } } },
      }),
    };
    const jobs = await this.jobRepo.findAll({
      where: where,
      include: { skills: true, company: true },
      skip: decodedCursor ? 1 : 0,
      cursor: decodedCursor ? { id: decodedCursor.id } : undefined,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
    });
    if (!jobs.length) return { message: 'no jobs found ' };
    const lastItem = jobs[jobs.length - 1];
    const nextCursor = encoderCursor(
      lastItem.id.toString(),
      lastItem.createdAt,
    );
    const response = {
      data: jobs,
      meta: { nextCursor },
    };
    await redis.set(
      redisKeys.allJobs(limit, nextCursor, JSON.stringify(filter)),
      JSON.stringify({ response }),
      'EX',
      60 * 60 * 12,
    );
    return response;
  };
  AllJobs = async (limit: number, cursor?: string) => {
    const decodedCursor = decoderCursor(cursor);
    const cached = await redis.get(redisKeys.allJobs(limit, cursor));
    if (cached) {
      const { jobs } = JSON.parse(cached);
      return jobs;
    }
    const jobs = await this.jobRepo.findAll({
      where: { status: JobStatus.open },
      select: {
        id: true,
        position: true,
        description: true,
        type: true,
        location: true,
        companyId: true,
        categoryId: true,
        applicationCount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      cursor: decodedCursor ? { id: decodedCursor.id } : undefined,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
      skip: decodedCursor ? 1 : 0,
    });
    if (!jobs.length) return { message: 'no jobs found ' };
    const lastItem = jobs[jobs.length - 1];
    const nextCursor = encoderCursor(
      lastItem.id.toString(),
      lastItem.createdAt,
    );
    await redis.set(
      redisKeys.allJobs(limit, nextCursor),
      JSON.stringify({ jobs }),
      'EX',
      60 * 60 * 12,
    );
    return {
      message: 'jobs found',
      data: jobs,
      meta: { nextCursor },
    };
  };
}
