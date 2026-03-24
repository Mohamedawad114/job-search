import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildCvPrompt, systemInstructions } from './ai.prompt';
import { PinoLogger } from 'nestjs-pino';
import Groq from 'groq-sdk';

export interface AnalysisResult {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  decision: 'ACCEPT' | 'REVIEW' | 'REJECT';
  skills: { name: string; matchScore: number }[];
}

@Injectable()
export class AIService implements OnModuleInit {
  private client: Groq;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.getOrThrow<string>('GROQ_API');
    this.client = new Groq({ apiKey });
    this.logger.info('Groq client initialized');
  }

  async analyzeCV(
    cvText: string,
    jobDescription: string,
    position: string,
    skills: string[],
  ): Promise<AnalysisResult> {
    const prompt = buildCvPrompt(cvText, jobDescription, position, skills);
    return this.generateWithRetry(prompt);
  }

  private async generateWithRetry(
    prompt: string,
    attempt = 0,
  ): Promise<AnalysisResult> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const text = completion.choices[0].message.content!;

      return JSON.parse(text) as AnalysisResult;
    } catch (err) {
      if (err?.status === 429 && attempt < 2) {
        this.logger.warn(
          `Rate limited, waiting 60s... (attempt ${attempt + 1})`,
        );
        await new Promise((r) => setTimeout(r, 60_000));
        return this.generateWithRetry(prompt, attempt + 1);
      }
      this.logger.error(`AI Analysis failed: ${err.message}`);
      throw err;
    }
  }
}
