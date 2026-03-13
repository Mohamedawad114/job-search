import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from './Base.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class ExperienceRepository extends BaseRepository<
  PrismaService['experience'],
  Prisma.ExperienceCreateInput,
  Prisma.ExperienceUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.experience);
  }
}
