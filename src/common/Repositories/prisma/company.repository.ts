import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from './Base.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCompanyDto } from 'src/modules/company/Dto';
@Injectable()
export class CompanyRepository extends BaseRepository<
  PrismaService['company'],
  Prisma.CompanyCreateInput,
  Prisma.CompanyUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.company);
  }
  async findAndUpdate(id: number, data: UpdateCompanyDto, options?: any) {
    if (!(await this.findById(id)))
      throw new NotFoundException('company not found');
    return await this.updateById(id, data, options);
  }
}
