import { Injectable } from '@nestjs/common';
import { BaseRepository } from './Base.repository';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyRepository } from './company.repository';

@Injectable()
export class JobRepository extends BaseRepository<
  PrismaService['job'],
  Prisma.JobCreateInput,
  Prisma.JobUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.job);
  }
  async transaction<T>(
    callback: (tx: PrismaService) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return callback(tx as any);
    });
  }

}
