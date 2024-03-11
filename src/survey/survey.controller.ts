import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSurveyAnswerAndRelationDto, CreateSurveyDto } from './dto/createSurvey.dto';


@ApiTags('survey')
@Controller('survey')
export class SurveyController {
    constructor(private readonly surveyService: SurveyService) { }

    @Get("get-school-question")
    async getSurveyTeacher() {
        return await this.surveyService.getSurveyByStudent();
    }

    @Get("get-school-survey-by-student/:id")
    async getSurveyByStudent(@Param('id') id: number) {
        return await this.surveyService.getSurveyByStudentId(id);
    }

    @Post("add-survey")
    async createSurvey(@Body() data: CreateSurveyDto[]) {
        await this.surveyService.createSurvey(data);
    }

    @Post("add-answer")
    async createAnswer(@Body() data: CreateSurveyAnswerAndRelationDto) {
        await this.surveyService.createAnswer(data);
    }

}

