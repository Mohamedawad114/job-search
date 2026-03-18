import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AIReportRepository,
  AISkillMatchRepository,
  IUser,
  JobRepository,

} from 'src/common';
import { redis, redisKeys } from 'src/common/Utils/services';

@Injectable()
export class AIReportsServices {
  constructor(
    private readonly aiReportRepo: AIReportRepository,
    private readonly aiSKillMatchRepo: AISkillMatchRepository,
    private readonly jobRepo: JobRepository,
  ) {}

  allJobReports = async (
    user: IUser,
    jobId: number,
    page: number,
    limit: number,
  ) => {
    const job = await this.jobRepo.findById(jobId, {
      select: { companyId: true },
    });
    if (!job) throw new NotFoundException('job not found');
    if (job.companyId !== user.companyId)
      throw new ForbiddenException(
        'you are not authorized to view these reports',
      );
    const cached = await redis.get(redisKeys.allJobReports(jobId, page, limit));
        if (cached) {
          const { reports, total } = JSON.parse(cached);
          return {
            data: reports,
            meta: { total, pages: Math.ceil(total / limit) },
          };
        }
    const offset = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      this.aiReportRepo.findAll({
        where: {
          application: {
            jobId: jobId,
          },
        },
        select: {
          summary: true,
          decision: true,
          id: true,
          application: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { ATSScore: 'desc' },
        take: limit,
        skip: offset,
      }),
       this.aiReportRepo.count({
        where: {
          application: {
            jobId: jobId,
          },
        },
      }),
    ]);
    if (!reports.length) return { message: 'no reports found for this job' };
    const cacheData = { reports, total };
    await redis.set(
      redisKeys.allJobReports(jobId, page, limit),
      JSON.stringify(cacheData),
      'EX',
      60 * 60 * 12,
    );
    return {
      message: 'job reports',
      data: reports,
      meta: {
        total,
        pages: Math.ceil(total / limit),
      },
    };
  };
  reportDetails = async (user: IUser, reportId: number) => {
    const report = await this.aiReportRepo.findById(reportId, {
      include: {
        application: {
          select: {
            job: {
              select: { companyId: true },
            },
          },
        },
      },
    });
    if (!report) throw new NotFoundException('report not found');
    if (report.application.job.companyId !== user.companyId)
      throw new ForbiddenException('not authorized');
    return { message: 'report data', data: report };
  };
  skillsReport = async (user: IUser, reportId: number) => {
    const report = await this.aiReportRepo.findById(reportId, {
      include: {
        application: { select: { job: { select: { companyId: true } } } },
      },
    });
    if (!report) throw new NotFoundException('report not found');
    if (report.application.job.companyId !== user.companyId)
      throw new ForbiddenException('not authorized');
    const skillsReport = await this.aiSKillMatchRepo.findAll({
      where: { reportId: reportId },
    });
    if (!skillsReport.length)
      return { message: 'no skills reports found for this report' };
    return {
      message: 'skill reports',
      data: skillsReport,
    };
  };
  getReportWithSkills = async (user: IUser, reportId: number) => {
    const { data } = await this.reportDetails(user, reportId);
    const skills = await this.skillsReport(user, reportId);

    return {
      message: 'report with skill Analysis',
      data: { ...data, skills: skills.data },
    };
  };
}
