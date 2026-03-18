import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ApplicationRepository,
  JobRepository,
  NotificationRepository,
  UserRepository,
} from 'src/common/Repositories';
import {
  ApplicationStatusEnum,
  JobStatus,
  NotificationType,
} from 'src/common/Enum';

import { PinoLogger } from 'nestjs-pino';
import { notificationHandler } from 'src/common/helpers';

@Processor('rejectedApplications')
@Injectable()
export class RejectedProcessor extends WorkerHost {
  constructor(
    private readonly applicationRepo: ApplicationRepository,
    private readonly jobRepo: JobRepository,
    private readonly notificationRepo: NotificationRepository,
    private readonly userRepo: UserRepository,
    private readonly logger: PinoLogger,
    // private readonly gateway: NotificationGateway,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'reject_others':
        return await this.handleRejectedApplications(job.data);
      case 'check_job_capacity':
        return await this.handleJobCapacity(job.data);
      case 'job_posted':
        return await this.JobPosted(job.data);

      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
        return { success: false };
    }
  }

  // ---  رفض الطلبات ---
  private async handleRejectedApplications(data: any) {
    const { applicationIds, jobId } = data;
    await this.applicationRepo.updateMany(
      { id: { nin: applicationIds }, jobId: jobId },
      { status: ApplicationStatusEnum.REJECTED },
    );
    return { success: true, rejectedCount: applicationIds.length };
  }

  private async handleJobCapacity(data: any) {
    const job = await this.jobRepo.findOne(
      {
        id: data.jobId,
        status: JobStatus.open,
      },
      {
        include: {
          company: {
            select: {
              adminId: true,
            },
          },
        },
      },
    );
    if (!job) throw new NotFoundException('job not found |closed');
    const { jobId, jobTitle, maxCount, adminId } = data;
    const { title, content } = notificationHandler(
      NotificationType.JOB_CAPACITY_FULL,
      { jobTitle, maxCount },
    );

    await this.notificationRepo.insert({
      userId: adminId,
      title,
      content,
    });
    await this.jobRepo.updateById(jobId, { status: JobStatus.closed });
    // 3. Socket.io
    // this.gateway.sendToUser(adminId, { title, content });

    this.logger.info(`Job ${jobId} closed due to capacity limit.`);
    return { success: true };
  }
  private async JobPosted(data: any) {
    const users = await this.userRepo.findAll({
      take: 20,
      select: { id: true },
    });
    users.map(async (user) => {
      const { companyName, jobPosition } = data;
      const { title, content } = notificationHandler(
        NotificationType.NEW_JOB_POSTED,
        { companyName, jobTitle: jobPosition },
      );
      await this.notificationRepo.insert({
        userId: user.id,
        title,
        content,
      });
    });
  }

  @OnWorkerEvent('completed')
  handleCompleted(job: Job) {
    this.logger.info(`Job ${job.id} (${job.name}) completed successfully`);
  }
  @OnWorkerEvent('completed')
  handleFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed: ${err.message}`);
  }
}
