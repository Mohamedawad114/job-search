import { Injectable, OnModuleInit } from '@nestjs/common';
import openAI from 'openai';
import { buildCvPrompt } from './ai.prompt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIService implements OnModuleInit {
  private openai: openAI;

  constructor(private readonly configService: ConfigService) {}
  onModuleInit() {
    const apiKey = this.configService.get<string>('OPEN_AI_KEY');
    if (!apiKey) {
      throw new Error('OPEN_AI_KEY is missing from environment variables');
    }
    this.openai = new openAI({ apiKey });
  }
  async analyzeCV(
    cvText: string,
    jobDescription: string,
    position: string,
    skills: string[],
  ) {
    const prompt = buildCvPrompt(cvText, jobDescription, position, skills);
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
    });
    const content = response.choices[0].message.content;

    return JSON.parse(content as unknown as string);
  }
}
