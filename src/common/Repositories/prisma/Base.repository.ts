import { PrismaService } from 'src/prisma/prisma.service';

export class BaseRepository<
  Model extends PrismaModelDelegate,
  CreateDto,
  UpdateDto,
> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: Model,
  ) {}
  async findAll(options?: any) {
    return this.model.findMany(options);
  }

  async findById(id: number, options?: any) {
    return this.model.findUnique({
      where: { id },
      ...options,
    });
  }
  async findOne(filter: object, options?: any) {
    return this.model.findUnique({
      where: filter,
      ...options,
    });
  }

  async create(data: CreateDto, options?: any) {
    return this.model.create({
      data,
      ...options,
    });
  }

  async update(filter: object, data: UpdateDto, options?: any) {
    return this.model.update({
      where: filter ,
      data,
      ...options,
    });
  }
  async updateById(id: number, data: UpdateDto, options?: any) {
    return this.model.update({
      where: { id },
      data,
      ...options,
    });
  }
  async updateMany(filter: object, data: UpdateDto, options?: any) {
    return this.model.updateMany({
      where: filter,
      data,
      ...options,
    });
  }

  async delete(filter: object, options?: any) {
    return this.model.delete({
      where: filter,
      ...options,
    });
  }

  async deleteMany(filter: object, options?: any) {
    return this.model.deleteMany({
      where: filter,
      ...options,
    });
  }
  async count(options?: any) {
    return this.model.count({
      where:options
    })
  }
}
type PrismaModelDelegate = {
  findMany(args?: any): any;
  findUnique(args: any): any;
  create(args: any): any;
  update(args: any): any;
  updateMany(args: any): any;
  delete(args: any): any;
  deleteMany(args: any): any;
  count(args?:any):any
};
