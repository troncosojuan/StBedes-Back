import { Module } from '@nestjs/common';
import { SurveyTeacherService } from './survey-teacher.service';
import { SurveyTeacherController } from './survey-teacher.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SurveyTeacherController],
  providers: [SurveyTeacherService, PrismaService],
})
export class SurveyTeacherModule {}
