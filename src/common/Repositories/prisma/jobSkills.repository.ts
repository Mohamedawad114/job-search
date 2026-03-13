import { Injectable } from '@nestjs/common';
import { BaseRepository } from './Base.repository';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobSkillRepository extends BaseRepository<
  PrismaService['jobSkill'],
  Prisma.JobSkillCreateInput,
  Prisma.JobSkillUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.jobSkill);
  }
  async createMany(data: Prisma.JobSkillCreateManyInput[]) {
    return await this.model.createMany({
      data,
    });
  }
}
