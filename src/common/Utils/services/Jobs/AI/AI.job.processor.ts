import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import {
  AIReportRepository,
  AISkillMatchRepository,
  ApplicationRepository,
} from 'src/common/Repositories';
import { AIService } from 'src/modules/AI/ai.service';
import { CvExtractorService } from '../../pdf-parser';

@Processor('AIAnalysis')
export class AIAnalysisProcessor extends WorkerHost {
  constructor(
    private applicationRepo: ApplicationRepository,
    private readonly aiService: AIService,
    private readonly cvExtractSErvice: CvExtractorService,
    private readonly AIReportRepo: AIReportRepository,
    private readonly AISkillMatchRepo: AISkillMatchRepository,
    private readonly logger: PinoLogger,
  ) {
    super();
  }
  async process(job: Job) {
    const { applicationId } = job.data;
    const application = await this.applicationRepo.findById(applicationId, {
      include: {
        job: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });
    const cvText = await this.cvExtractSErvice.extractText(application.cvUrl);
    const skills = application.job.skills.map((s) => s.skill.skill);
    const result = await this.aiService.analyzeCV(
      cvText,
      application.job.description,
      application.job.position,
      skills,
    );
    const analysis = await this.AIReportRepo.create({
      application: {
        connect: { id: applicationId },
      },
      ATSScore: result.atsScore,
      summary: result.summary,
      strengths: result.strengths.join('\n'),
      weaknesses: result.weaknesses.join('\n'),
      decision: result.decision,
    });
    for (const skill of result.skills) {
      await this.AISkillMatchRepo.create({
        report: { connect: { id: analysis.id } },
        skillName: skill.name,
        matchScore: skill.matchScore,
      });
    }
  }
  @OnWorkerEvent('completed')
  handleCompleted(job: Job) {
    this.logger.info(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  handleFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed: ${err.message}`);
  }
}
