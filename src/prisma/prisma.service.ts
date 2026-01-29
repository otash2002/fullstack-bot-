
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // FIX: When extending PrismaClient, the constructor of the base class must be called
  // via super() to ensure proper initialization. This resolves TypeScript errors
  // related to missing Prisma Client methods (like `$connect`) and models (like `user`).
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
