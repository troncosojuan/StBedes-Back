import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [TeacherService, PrismaService],
  controllers: [TeacherController]
})
export class TeacherModule {}
