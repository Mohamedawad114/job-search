import { Injectable } from '@nestjs/common';
import { BaseRepository } from './Base.repository';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UserRepository extends BaseRepository<
  PrismaService['user'],
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.user);
  }
  async findByEmail(email: string, options?: any) {
    return this.model.findUnique({
      where: { email },
      ...options,
    });
  }
}
