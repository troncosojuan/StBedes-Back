import { Controller, Get, Param } from '@nestjs/common';
import { QuestionStudentService } from './question_student.service';
import { QuestionStudentResponseDto } from './dto/question.response.dto';

@Controller('question')
export class QuestionStudentController {
    constructor(private readonly questionService: QuestionStudentService) { }

    @Get("activeQuestions/:studentId")
    async getActiveQuestions(@Param("studentId") studentId: string): Promise<QuestionStudentResponseDto[]> {
        return await this.questionService.getActiveQuestions(studentId);
    }

}
