import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { CreatQuestionDto } from './dto/createQuestion.dto';


@ApiTags('question')
@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) { }

    @Post('createMany')
    @ApiResponse({ status: 201, description: "Questions created successfully" })
    async createMany(@Body() createStudentDto: CreatQuestionDto[]) {
        await this.questionService.createMany(createStudentDto);
    }

    @Post('create')
    @ApiResponse({ status: 201, description: "Question created successfully" })
    async create(@Body() createStudentDto: CreatQuestionDto) {
        await this.questionService.create(createStudentDto);
    }

}
