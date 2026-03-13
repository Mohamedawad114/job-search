import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from './Base.repository';

@Injectable()
export class ApplicationRepository extends BaseRepository<
  PrismaService['application'],
  Prisma.ApplicationCreateInput,
  Prisma.ApplicationUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.application);
  }
}
