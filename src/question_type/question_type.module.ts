import { Module } from '@nestjs/common';
import { QuestionTypeService } from './question_type.service';
import { QuestionTypeController } from './question_type.controller';

@Module({
  controllers: [QuestionTypeController],
  providers: [QuestionTypeService],
})
export class QuestionTypeModule {}
