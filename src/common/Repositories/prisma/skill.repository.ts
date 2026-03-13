import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from './Base.repository';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SkillRepository extends BaseRepository<
  PrismaService['skill'],
  Prisma.SkillCreateInput,
  Prisma.SkillUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.skill);
  }
}
