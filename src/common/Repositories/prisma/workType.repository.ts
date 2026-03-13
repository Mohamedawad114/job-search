import { Injectable } from '@nestjs/common';
import { BaseRepository } from './Base.repository';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class WorkTypeRepository extends BaseRepository<
  PrismaService['workType'],
  Prisma.WorkTypeCreateInput,
  Prisma.WorkTypeUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.workType);
  }
}
