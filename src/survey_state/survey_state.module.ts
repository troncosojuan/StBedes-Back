import { Module } from '@nestjs/common';
import { SurveyStateController } from './survey_state.controller';
import { SurveyStateService } from './survey_state.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SurveyStateController],
  providers: [SurveyStateService, PrismaService]
})
export class SurveyStateModule {}
