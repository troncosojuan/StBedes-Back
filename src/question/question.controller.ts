import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService = new QuestionService()) {}
    @Get("activeQuestions/:studentId")
    async getActiveQuestions(@Param("studentId") studentId: string): Promise<any> {
        return await this.questionService.getActiveQuestions(studentId);
    }
    
}
