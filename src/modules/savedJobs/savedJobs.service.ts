import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser, JobRepository, SavedJobRepository } from 'src/common';

@Injectable()
export class SavedJobService {
  constructor(
    private readonly savedJobRepo: SavedJobRepository,
    private readonly jobRepo: JobRepository,
  ) {}
  addToSavedJobs = async (jobId: number, user: IUser) => {
    const job = await this.jobRepo.findOne({ id: jobId });
    if (!job) throw new NotFoundException('Job not found');
    const isSavedJob = await this.savedJobRepo.findOne({
      jobId: jobId,
      userId: user.id,
    });
    if (isSavedJob) return { message: 'Job already saved' };
    const savedJob = await this.savedJobRepo.create({
      job: { connect: { id: jobId } },
      user: { connect: { id: user.id } },
    });
    return { message: 'Job saved successfully', data: savedJob };
  };
  removeFromSavedJobs = async (jobId: number, user: IUser) => {
    const job = await this.jobRepo.findOne({ id: jobId });
    if (!job) throw new NotFoundException('Job not found');
    const deletedJob = await this.savedJobRepo.delete({
      jobId: jobId,
      userId: user.id,
    });
    if (!deletedJob) throw new NotFoundException('Saved job not found');
    return { message: 'Job removed successfully', data: deletedJob };
  };
  mySavedJobs = async (user: IUser, page: number, limit: number) => {
    const [savedJobs, count] = await Promise.all([
      this.savedJobRepo.findAll({
        where: { userId: user.id },
        skip: (page - 1) * limit,
          take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.savedJobRepo.count({ where: { userId: user.id } }),
    ]);

    return {
      message: 'Saved jobs',
      data: savedJobs,
      meta: {
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  };
}
