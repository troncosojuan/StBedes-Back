import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatQuestionDto } from './dto/createQuestion.dto';

@Injectable()
export class QuestionService {
    constructor(private readonly prisma: PrismaService) { }


    async createMany(createStudentDto: CreatQuestionDto[]) {
        await this.prisma.question.createMany({
            data: createStudentDto
        });
    }
    async create(createStudentDto: CreatQuestionDto) {
        await this.prisma.question.create({
            data: createStudentDto
        });
    }
}
