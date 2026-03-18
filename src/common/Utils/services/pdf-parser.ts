import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
const pdf = require('pdf-parse');

export interface ICvExtractor {
  extractText(url: string): Promise<string>;
}

@Injectable()
export class CvExtractorService implements ICvExtractor {
  constructor(private readonly logger: PinoLogger) {}

  async extractText(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`فشل تحميل الملف: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdf(buffer);
      return data.text;
    } catch (error) {
      this.logger.error('CvExtractorService Error:', error);
      throw new Error('حدث خطأ أثناء معالجة ملف PDF.');
    }
  }
}
