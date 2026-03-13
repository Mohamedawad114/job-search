import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from './Base.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class EducationRepository extends BaseRepository<
  PrismaService['education'],
  Prisma.EducationCreateInput,
  Prisma.EducationUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.education);
  }
}
