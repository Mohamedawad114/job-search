import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from './Base.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AIReportRepository extends BaseRepository<
  PrismaService['aIReport'],
  Prisma.AIReportCreateInput,
  Prisma.AIReportUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.aIReport);
  }
}
@Injectable()
export class AISkillMatchRepository extends BaseRepository<
  PrismaService['aISkillMatch'],
  Prisma.AISkillMatchCreateInput,
  Prisma.AIReportUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.aISkillMatch);
  }
}
