import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveyParentService } from './survey-parent.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSurveyParentAnswerAndRelationDto, CreateSurveyParentAnswerDto, CreateSurveyParentDto, CreateSurveyParentTriggerDto } from './dto/survey-parent.dto';


@ApiTags('survey-parent')
@Controller('survey-parent')
export class SurveyParentController {
  constructor(private readonly surveyParentService: SurveyParentService, ) {}

  @Get("get-survey-parent-by-parent/:id")
  @ApiResponse({ status: 200, description: "Survey parent retrieved successfully" })
    async getSurveyParent(@Param('id') id: number) {
        return await this.surveyParentService.getSurveyParentByParentId(id);
    }

    @Get("get-survey-by-parent/:id")
    @ApiResponse({ status: 200, description: "Survey parent retrieved successfully" })
    async getSurveyByParent(@Param('id') id: number) {
        return await this.surveyParentService.getSurveyByParentId(id);
    }

    @Get("get-question-parent-by-student/:id")
    @ApiResponse({ status: 200, description: "Survey parent question retrieved successfully" })
    async getQuestionParent(@Param('id') id: number) {
        return await this.surveyParentService.getQuestionParentByStudent(id);
    }


    @Post("add-survey-parent")
    @ApiResponse({ status: 200, description: "Survey parent created successfully" })
    async createSurveyParent(@Body() data: CreateSurveyParentDto[]) {
        await this.surveyParentService.createSurveyParent(data);
    }

    @Post("add-answer-parent")
    @ApiResponse({ status: 200, description: "Survey parent answer created successfully" })
    async createParentAnswer(@Body() data: CreateSurveyParentAnswerAndRelationDto) {
        await this.surveyParentService.createParentAnswer(data);
    }


    @Post("add-survey-parent-trigger")
    @ApiResponse({ status: 200, description: "Survey parent trigger created successfully" })
    async createSurveyParentTrigger(@Body() data: CreateSurveyParentTriggerDto[]) {
        await this.surveyParentService.createSurveyParentTrigger(data);
    }



}
