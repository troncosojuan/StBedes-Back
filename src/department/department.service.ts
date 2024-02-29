import { Injectable } from '@nestjs/common';
import { CreatDepartmentDto } from './dto/creatDepartment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartmentService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createStudentDto: CreatDepartmentDto) {
    return this.prismaService.department.create({
      data: createStudentDto
    });
  }
  
  async createMany(createDepartmentDto: CreatDepartmentDto[]) {
    return this.prismaService.department.createMany({
      data: createDepartmentDto
    });
  }
}
