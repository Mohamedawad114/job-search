import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from './Base.repository';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserSkillRepository extends BaseRepository<
  PrismaService['userSkill'],
  Prisma.UserSkillCreateInput,
  Prisma.UserSkillUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.userSkill);
  }
  async findOneUSerSkill(filter: object, options?: any) {
    return this.model.findFirst({
      where: filter,
      ...options,
    });
  }
}
