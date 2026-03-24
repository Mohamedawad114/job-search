import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from './Base.repository';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SavedJobRepository extends BaseRepository<
  PrismaService['savedJob'],
  Prisma.SavedJobCreateInput,
  Prisma.SavedJobUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.savedJob);
  }
  async findOneSavedJob(filter: object, options?: any) {
    return this.model.findFirst({
      where: filter,
      ...options,
    });
  }
}
