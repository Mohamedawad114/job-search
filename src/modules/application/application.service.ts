import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ApplicationRepository,
  ApplicationStatusEnum,
  EmailProducer,
  emailType,
  IUser,
  JobRepository,
  redis,
  redisKeys,
} from 'src/common';
import { applicationStatus, createApplication } from './Dto';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly jobRepo: JobRepository,
    private readonly emailQueue: EmailProducer,
  ) {}

  apply = async (
    user: IUser,
    jobId: number,
    data: createApplication,
    idempotencyKey: string,
  ) => {
    const isDuplicated = await redis.get(
      redisKeys.idempotencyKey(idempotencyKey, 'apply', user.id),
    );
    if (isDuplicated) throw new ConflictException('application already exists');
    const CV = data.CV ?? user.CV;
    if (!CV) throw new BadRequestException('cv must upload');
    const isApplied = await this.applicationRepository.findOne({
      userId: user.id,
      jobId: jobId,
    });
    if (isApplied) throw new ConflictException('application already exists');
    const application = await this.applicationRepository.create({
      ...data,
      CV: CV,
      user: { connect: { id: user.id } },
      job: { connect: { id: jobId } },
    });
    await redis.set(
      redisKeys.idempotencyKey(idempotencyKey, 'apply', user.id),
      'true',
      'EX',
      60 * 60 * 5,
    );
    return {
      message: 'application created successfully',
      data: application,
    };
  };
  getApply = async (user: IUser, applyId: number) => {
    const application = await this.applicationRepository.findOne({
      userId: user.id,
      id: applyId,
    });
    if (!application) throw new ConflictException('application not found');
    return {
      message: 'application ',
      data: application,
    };
  };
  allUserApplications = async (user: IUser, page: number, limit: number) => {
    const [applications, total] = await Promise.all([
      this.applicationRepository.findAll({
        where: { userId: user.id },
        skip: (page - 1) * limit,
        take: limit,
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
    const job = await this.jobRepo.findOne({
      id: jobId,
      companyId: user.companyId,
    });
    if (!job) throw new NotFoundException('job not found');
    const [applications, total] = await Promise.all([
      this.applicationRepository.findAll({
        where: { jobId: jobId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
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
    return {
      message: 'all applications ',
      data: applications,
      meta: {
        total,
        pages: Math.ceil(total / limit),
      },
    };
  };
  changeApplicationStatus = async (
    applyIds: number[],
    status: applicationStatus,
  ) => {
    const applications = await this.applicationRepository.findAll({
      where: { id: { in: applyIds } },
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
    if (applications.length !== applyIds.length)
      throw new NotFoundException('application not found');
    await Promise.all(
      applications.map((app) =>
        this.emailQueue.sendEmailJob(
          emailType.applicationStatus,
          app.user.email,
          app.jop.company.name,
          app.job.position,
          ApplicationStatusEnum.ACCEPTED,
        ),
      ),
    );

    const [updatedApplication] = await Promise.all([
      this.applicationRepository.updateMany(
        { id: { in: applyIds } },
        {
          status: status,
        },
      ),
      this.applicationRepository.updateMany(
        {
          id: { nin: applyIds },
        },
        {
          status: ApplicationStatusEnum.REJECTED,
        },
      ),
    ]);
    return {
      message: 'application status updated successfully',
      data: updatedApplication,
    };
  };
}
