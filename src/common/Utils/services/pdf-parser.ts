import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
const pdfParse = require('pdf-parse');

@Injectable()
export class CvExtractorService {
  constructor(private readonly logger: PinoLogger) {}
  async extractText(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdfParse(buffer);
      if (!data.text.trim()) {
        throw new Error('Empty PDF text (maybe scanned)');
      }
      return data.text;
    } catch (error) {
      this.logger.error({ err: error }, 'CvExtractorService Error');
      throw error;
    }
  }
}
