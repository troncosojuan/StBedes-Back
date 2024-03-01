import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateSurveyTeacherDto } from './dto/createSurvey.dto';

@ApiTags('survey')
@Controller('survey')
export class SurveyController {
    constructor(private readonly surveyService: SurveyService) {}
    

    @Get("get-survey-by-student/:id")
    async getSurveyTeacher(@Param('id') id: number) {
        await this.surveyService.getSurveysTeacherByStudent(id);
    }

    @Get("get-questions/:id")
    async getSurveyQuestion(@Param('id') id: number) {
        await this.surveyService.getSurveyQuestionBySurveyId(id);
    }

    @Get("get-teacher-questions/:id")
    async getSurveyTeacherQuestion(@Param('id') id: number) {
        await this.surveyService.getSurveyTeacherQuestionsBySurveyTeacherId(id);
    }

    @Post("add-teacher-answer")
    async createTeacherAnswer(@Body() data: any) {
        await this.surveyService.createTeacherAnswer(data);
    }

    @Post("add-answer")
    async createAnswer(@Body() data: any) {
        await this.surveyService.createAnswer(data);
    }

    @Post("add-survey-teacher")
    async createSurveyTeacher(@Body() data: CreateSurveyTeacherDto[]) {
        await this.surveyService.createSurveyTeacher(data);
    }
}

