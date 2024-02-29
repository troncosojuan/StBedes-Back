import { Module } from '@nestjs/common';
import { SetService } from './set.service';
import { SetController } from './set.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SetController],
  providers: [SetService, PrismaService],
})
export class SetModule {}
