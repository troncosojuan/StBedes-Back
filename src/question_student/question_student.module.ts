import { Module } from '@nestjs/common';
import { QuestionStudentService } from './question_student.service';
import { QuestionStudentController } from './question_student.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [QuestionStudentService, PrismaService],
  controllers: [QuestionStudentController]
})
export class QuestionStudentModule { }
