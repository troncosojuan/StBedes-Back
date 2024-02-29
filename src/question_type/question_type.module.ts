import { Module } from '@nestjs/common';
import { QuestionTypeService } from './question_type.service';
import { QuestionTypeController } from './question_type.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [QuestionTypeController],
  providers: [QuestionTypeService, PrismaService],
})
export class QuestionTypeModule {}
