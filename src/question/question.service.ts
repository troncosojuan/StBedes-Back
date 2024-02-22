import { Get, Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionService {
    constructor(private readonly prisma: PrismaService = new PrismaService()) {}

    async getActiveQuestions(studentId : any): Promise<any> {
        const questions = await this.prisma.active_question_student.findMany({
            where: {
                student_id: studentId 
            }
        })
        return questions;
    }
}
