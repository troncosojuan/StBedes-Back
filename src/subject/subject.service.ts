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

  async setAllSubjectsStatus(subjects) {
    for(let i = 0; i < subjects.length; i++){
      const subjectDB = await this.prismaService.subject.findFirst({
        where: {
          subject_name: subjects[i][0]
        },
      })
      if(subjectDB){
        const response = await this.prismaService.subject.update({
          where: {
            subject_id: subjectDB.subject_id 
          },
          data: {
            is_included: subjects[i][1]
          }
        })
      }
     
    }
  }
}
