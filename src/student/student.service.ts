import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFamilyDto, CreateParentDto, CreateStudentByYearDto, CreateStudentDto } from './dto/createStudent.dto';

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

    async createStudentByYear(createStudentDto: CreateStudentByYearDto[]) {
        await this.prisma.student_by_year.createMany({
            data: createStudentDto
        });
    }

    async createParent(createParentDto: CreateParentDto[]) {
        await this.prisma.parent.createMany({
            data: createParentDto
        });
    }

    async createFamily(createFamilyDto: CreateFamilyDto[]) {
        await this.prisma.family.createMany({
            data: createFamilyDto
        });
    }
}
