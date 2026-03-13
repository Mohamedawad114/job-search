import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { HashingService } from '../common/Utils/Hashing/hash.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: PinoLogger,
    private readonly hashService: HashingService,
  ) {
    super();

    const hashingService = this.hashService;

    Object.assign(
      this,
      this.$extends({
        query: {
          user: {
            async create({ args, query }) {
              if (args.data.password) {
                args.data.password = await hashingService.generateHash(
                  args.data.password as string,
                );
              }

              return query(args);
            },

            async update({ args, query }) {
              if (args.data.password) {
                if (typeof args.data.password === 'string') {
                  args.data.password = await hashingService.generateHash(
                    args.data.password,
                  );
                } else if (args.data.password.set) {
                  args.data.password.set = await hashingService.generateHash(
                    args.data.password.set,
                  );
                }
              }

              return query(args);
            },
          },

          company: {
            async delete({ args, query }) {
              return query({
                ...args,
                data: {
                  deletedAt: new Date(),
                },
              });
            },

            async findMany({ args, query }) {
              args.where = {
                ...(args.where || {}),
                deletedAt: null,
              };
              return query(args);
            },
          },
        },
      }),
    );
  }

  async onModuleInit() {
    this.logger.info(`Connecting to the database...`);
    await this.$connect();
    this.logger.info(`Connected to the database successfully.`);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
