import { Body, Controller, Post } from '@nestjs/common';
import { QuestionTypeService } from './question_type.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionType } from './dto/createQuestionType.dto';

@ApiTags('question-type')
@Controller('question-type')
export class QuestionTypeController {
  constructor(private readonly questionTypeService: QuestionTypeService) {}

  @Post('createMany')
  @ApiResponse({ status: 201, description: "Question Type created successfully" })
  async createMany(@Body() createQuestionTypeDto: CreateQuestionType[]){
    await this.questionTypeService.createMany(createQuestionTypeDto);
  }
}
