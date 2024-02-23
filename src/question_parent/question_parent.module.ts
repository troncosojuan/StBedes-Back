import { Module } from '@nestjs/common';
import { QuestionParentService } from './question_parent.service';
import { QuestionParentController } from './question_parent.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [QuestionParentService, PrismaService],
  controllers: [QuestionParentController]
})
export class QuestionParentModule {}
