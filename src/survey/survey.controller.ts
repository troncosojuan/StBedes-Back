import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSurveyAnswerAndRelationDto, CreateSurveyDto, CreateSurveyTriggerDto } from './dto/createSurvey.dto';


@ApiTags('survey')
@Controller('survey')
export class SurveyController {
    constructor(private readonly surveyService: SurveyService) { }

    @Get("get-school-question")
    @ApiResponse({ status: 200, description: "Survey retrieved successfully" })
    async getSurveyTeacher() {
        return await this.surveyService.getSurveyByStudent();
    }

    @Get("get-school-survey-by-student/:id")
    @ApiResponse({ status: 200, description: "Survey retrieved successfully" })
    async getSurveyByStudent(@Param('id') id: number) {
        return await this.surveyService.getSurveyByStudentId(id);
    }

    @Post("add-survey")
    @ApiResponse({ status: 201, description: "Survey created successfully" })
    async createSurvey(@Body() data: CreateSurveyDto[]) {
       return await this.surveyService.createSurvey(data);
    }

    @Post("add-answer")
    @ApiResponse({ status: 201, description: "Survey answer created successfully" })
    async createAnswer(@Body() data: CreateSurveyAnswerAndRelationDto) {
        await this.surveyService.createAnswer(data);
    }

    @Post("add-survey-trigger")
    @ApiResponse({ status: 201, description: "Survey trigger created successfully" })
    async createSurveyTrigger(@Body() data: CreateSurveyTriggerDto[]) {
        await this.surveyService.createSurveyTrigger(data);
    }

   
}

