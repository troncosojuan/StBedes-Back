import { Module } from '@nestjs/common';
import { SurveyStateController } from './survey_state.controller';
import { SurveyStateService } from './survey_state.service';

@Module({
  controllers: [SurveyStateController],
  providers: [SurveyStateService]
})
export class SurveyStateModule {}
