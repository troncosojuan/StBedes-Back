import { Get, Injectable, Param } from '@nestjs/common';

@Injectable()
export class QuestionService {
    constructor(private readonly questionService: QuestionService = new QuestionService()) {}

    @Get("activeQuestions/:studentId")
    async getActiveQuestions(@Param("studentId") studentId: string): Promise<any> {
        return await this.questionService.getActiveQuestions(studentId);
    }
}
