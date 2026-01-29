
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [BotService],
})
export class BotModule {}
