import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/createSubject';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createSubjectDto: CreateSubjectDto) {
    await this.prismaService.subject.create({
      data: createSubjectDto
    });
  }
  async createMany(createSubjectDto: CreateSubjectDto[]) {
    return this.prismaService.subject.createMany({
      data: createSubjectDto
    });
  }

  async getAllSubjectsStatus() {
    return this.prismaService.subject.findMany({
      select: {
        is_included: true,
        subject_name: true
      }
    });
  }
}
