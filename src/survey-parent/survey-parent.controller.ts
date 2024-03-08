import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveyParentService } from './survey-parent.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateSurveyParentAnswerAndRelationDto, CreateSurveyParentAnswerDto, CreateSurveyParentDto } from './dto/survey-parent.dto';


@ApiTags('survey-parent')
@Controller('survey-parent')
export class SurveyParentController {
  constructor(private readonly surveyParentService: SurveyParentService, ) {}

  @Get("get-survey-parent-by-parent/:id")
    async getSurveyParent(@Param('id') id: number) {
        return await this.surveyParentService.getSurveyParentByParentId(id);
    }

    @Get("get-survey-by-parent/:id")
    async getSurveyByParent(@Param('id') id: number) {
        return await this.surveyParentService.getSurveyByParentId(id);
    }

    @Get("get-question-parent-by-student/:id")
    async getQuestionParent(@Param('id') id: number) {
        return await this.surveyParentService.getQuestionParentByStudent(id);
    }


    @Post("add-survey-parent")
    async createSurveyParent(@Body() data: CreateSurveyParentDto[]) {
        await this.surveyParentService.createSurveyParent(data);
    }

    @Post("add-answer-parent")
    async createParentAnswer(@Body() data: CreateSurveyParentAnswerAndRelationDto) {
        await this.surveyParentService.createParentAnswer(data);
    }




}
