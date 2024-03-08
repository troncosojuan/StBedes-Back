import { Module } from '@nestjs/common';
import { SurveyParentService } from './survey-parent.service';
import { SurveyParentController } from './survey-parent.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SurveyParentController],
  providers: [SurveyParentService, PrismaService],
})
export class SurveyParentModule {}
