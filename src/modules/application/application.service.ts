import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ApplicationRepository,
  IUser,
  JobRepository,
  notificationHandler,
  NotificationRepository,
} from 'src/common';
import {
  AIPAnalysisProducer,
  EmailProducer,
  redis,
  redisKeys,
  rejectedApplicationsProducer,
} from 'src/common/Utils/services/index';
import {
  Sys_Role,
  emailType,
  JobStatus,
  ApplicationStatusEnum,
  NotificationType,
} from 'src/common/Enum';
import { applicationStatus, createApplication } from './Dto';
import { Gateway } from '../gateway/gateway';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly jobRepo: JobRepository,
    private readonly emailQueue: EmailProducer,
    private readonly dbQueue: rejectedApplicationsProducer,
    private readonly AiJobQueue: AIPAnalysisProducer,
    private readonly NotificationRepo: NotificationRepository,
    private readonly SocketGateway: Gateway,
  ) {}

  apply = async (
    user: IUser,
    jobId: number,
    data: createApplication,
    idempotencyKey: string,
  ) => {
    const isNew = await redis.set(
      redisKeys.idempotencyKey(idempotencyKey, 'apply', user.id),
      '1',
      'EX',
      60 * 5,
      'NX',
    );
    if (!isNew) throw new ConflictException('application already exists');
    const CV = data.CV ?? user.CV;
    if (!CV) throw new BadRequestException('cv must upload');
    const job = await this.jobRepo.findOne(
      { id: jobId, status: JobStatus.open },
      {
        select: {
          company: { select: { adminId: true } },
        },
      },
    );
    if (!job) throw new NotFoundException('job not found');
    const apply = await this.applicationRepository.transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          ...data,
          CV,
          user: { connect: { id: user.id } },
          job: { connect: { id: jobId } },
        },
      });
      await tx.job.update({
        where: { id: jobId },
        data: { applicationCount: { increment: 1 } },
      });
      return application;
    });
    const stream = redis.scanStream({
      match: redisKeys.JobApplication(jobId, '*', '*'),
      count: 100,
    });
    stream.on('data', (keys) => {
      if (keys.length > 0) {
        redis.del(...keys);
      }
    });
    await this.AiJobQueue.analysis(apply.id);
    await this.dbQueue.changeJobStatus(jobId);
    await this.SocketGateway.userApplication(job.company.adminId, apply);
    return {
      message: 'application created successfully',
      data: apply,
    };
  };
  getSpecApply = async (user: IUser, applyId: number) => {
    const application = await this.applicationRepository.findById(applyId, {
      select: {
        id: true,
        status: true,
        CV: true,
        createdAt: true,
        noticePeriod: true,
        city: true,
        phone: true,
        expectedSalary: true,
        job: {
          select: {
            companyId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            CV: true,
          },
        },
      },
    });
    if (!application) throw new NotFoundException('application not found');
    if (user.role == Sys_Role.user) {
      if (
        application.user.id !== user.id &&
        user.companyId !== application.job.companyId
      )
        throw new ForbiddenException();
    }
    if (
      application.status == ApplicationStatusEnum.PENDING &&
      user.role == Sys_Role.company_admin
    ) {
      await this.applicationRepository.updateById(applyId, {
        status: ApplicationStatusEnum.REVIEWED,
      });
    }
    return {
      message: 'application details ',
      data: application,
    };
  };
  allUserApplications = async (user: IUser, page: number, limit: number) => {
    const [applications, total] = await Promise.all([
      this.applicationRepository.findAll({
        where: { userId: user.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.applicationRepository.count({ where: { userId: user.id } }),
    ]);
    return {
      message: 'all applications ',
      data: applications,
      meta: {
        total,
        pages: Math.ceil(total / limit),
      },
    };
  };
  allJobApplications = async (
    user: IUser,
    jobId: number,
    page: number,
    limit: number,
  ) => {
    const cached = await redis.get(
      redisKeys.JobApplication(jobId, page, limit),
    );
    if (cached) {
      if (cached) {
        const { applications, total } = JSON.parse(cached);
        return {
          data: applications,
          meta: { total, pages: Math.ceil(total / limit) },
        };
      }
    }
    const job = await this.jobRepo.findOne({
      id: jobId,
      companyId: user.companyId,
    });
    if (!job) throw new NotFoundException('job not found');
    const [applications, total] = await Promise.all([
      this.applicationRepository.findAll({
        where: { jobId: jobId },
        select: {
          id: true,
          phone: true,
          CV: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              CV: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.applicationRepository.count({ where: { jobId: jobId } }),
    ]);
    const cacheData = { applications, total };
    await redis.set(
      redisKeys.JobApplication(jobId, page, limit),
      JSON.stringify(cacheData),
      'EX',
      60 * 60 * 12,
    );

    return {
      message: 'all job applications ',
      data: applications,
      meta: {
        total,
        pages: Math.ceil(total / limit),
      },
    };
  };
  acceptApplications = async (
    jobId: number,
    data: applicationStatus,
    user: IUser,
  ) => {
    const setOfApplyIds = Array.from(new Set(data.applyIds));
    const job = await this.jobRepo.findOne({
      id: jobId,
      companyId: user.companyId,
    });
    if (!job) throw new NotFoundException('job not found | forbidden');
    const applications = await this.applicationRepository.findAll({
      where: { id: { in: setOfApplyIds }, jobId: jobId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        job: {
          select: {
            position: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (applications.length !== setOfApplyIds.length)
      throw new NotFoundException('application not found');
    const updatedApplication = await this.applicationRepository.updateMany(
      { id: { in: setOfApplyIds }, jobId: jobId },
      {
        status: ApplicationStatusEnum.ACCEPTED,
      },
    );
    applications.map(async (app) => {
      const { title, content } = notificationHandler(
        NotificationType.JOB_ACCEPTED,
        { jobTitle: app.job.position, companyName: app.job.company.name },
      );
      const notification = await this.NotificationRepo.insert({
        userId: app.userId,
        title: title,
        content: content,
      });
      await this.SocketGateway.sendNotification({
        userId: app.userId,
        notification: notification,
      });
    });

    await this.dbQueue.sendRejectedApplications(setOfApplyIds, jobId);
    await Promise.all(
      applications.map((app) =>
        this.emailQueue.sendEmailJob(
          emailType.applicationStatus,
          app.user.email,
          app.job.company.name,
          app.job.position,
        ),
      ),
    );
    return {
      message: 'application status updated successfully',
      data: updatedApplication,
    };
  };
}
