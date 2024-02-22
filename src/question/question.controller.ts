import { Controller } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('question')
export class QuestionController {
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
