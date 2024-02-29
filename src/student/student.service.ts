import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/createStudent.dto';

@Injectable()
export class StudentService {
    constructor(private readonly prisma: PrismaService) { }

    
    async create(createStudentDto: CreateStudentDto) {
        await this.prisma.student.create({
            data: createStudentDto
        });
    }
    async createMany(createStudentDto: CreateStudentDto[]) {
        await this.prisma.student.createMany({
            data: createStudentDto
        });
    }
}
