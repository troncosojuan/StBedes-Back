import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TeacherModule } from './teacher/teacher.module';
import { SurveyModule } from './survey/survey.module';
import { QuestionModule } from './question/question.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';
import { SubjectModule } from './subject/subject.module';
import { SetModule } from './set/set.module';
import { SetlistModule } from './setlist/setlist.module';
import { YearGroupModule } from './year_group/year_group.module';
import { QuestionTypeModule } from './question_type/question_type.module';



@Module({
  imports: [
    TeacherModule,
    SurveyModule,
    QuestionModule,
    StudentModule,
    AuthModule,
    UserModule,
    DepartmentModule,
    SubjectModule,
    SetModule,
    SetlistModule,
    YearGroupModule,
    QuestionTypeModule,
  ],
  providers: [
    PrismaService,
  ],
})
export class AppModuleV1 {
}

