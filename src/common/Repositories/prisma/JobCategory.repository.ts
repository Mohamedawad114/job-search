import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from './Base.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class JobCategoryRepository extends BaseRepository<
  PrismaService['jobCategory'],
  Prisma.JobCategoryCreateInput,
  Prisma.JobCategoryUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.jobCategory);
  }
}
