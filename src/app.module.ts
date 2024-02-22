import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
  QuestionModule],
  providers: [
    PrismaService, 
  ],
})
export class AppModuleV1 {
}

