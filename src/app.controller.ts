import { Controller, Get, } from '@nestjs/common';

@Controller('/health')
export class AppController {
  constructor() {}

  @Get()
  getHello() {
    return { message: 'Welcome to Job Search API 🚀' };
  }
}