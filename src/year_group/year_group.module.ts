import { Module } from '@nestjs/common';
import { YearGroupService } from './year_group.service';
import { YearGroupController } from './year_group.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [YearGroupController],
  providers: [YearGroupService, PrismaService],
})
export class YearGroupModule {}
