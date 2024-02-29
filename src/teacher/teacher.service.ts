import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeacherDto } from './dto/createTeacher.dto';

@Injectable()
export class TeacherService {
    
    constructor(private readonly prismaService: PrismaService) { }

    async createMany(createTeacherDto: CreateTeacherDto[]) {
        await this.prismaService.teacher.createMany({
            data: createTeacherDto
        });
    }


    async create(createTeacherDto: CreateTeacherDto) {
        await this.prismaService.teacher.create({
            data: createTeacherDto
        });
    }
}
