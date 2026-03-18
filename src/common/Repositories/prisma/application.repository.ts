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
  async transaction<T>(
    callback: (tx: PrismaService) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return callback(tx as any);
    });
  }
}
