import {  Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { QuestionStudentModule } from './question_student/question_student.module';
import { TeacherModule } from './teacher/teacher.module';
import { QuestionParentModule } from './question_parent/question_parent.module';


@Module({
  imports: [
    QuestionStudentModule,
    QuestionParentModule,
    TeacherModule],
  providers: [
    PrismaService,
  ],
})
export class AppModuleV1 {
}

