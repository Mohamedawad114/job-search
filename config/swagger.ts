import { DocumentBuilder } from '@nestjs/swagger';
export const config = new DocumentBuilder()
  .setTitle('Job Search API')
  .setDescription(
    'REST API for managing job postings, applications, and candidate profiles.',
  )
  .setVersion('1.0')
  .addBearerAuth({
    scheme: 'bearer',
    bearerFormat: 'JWT',
    type: 'http',
    in: 'Authorization',
    name: 'accessToken',
  })
  .addServer('http://localhost:3000')
  .build();
