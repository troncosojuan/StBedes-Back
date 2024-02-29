import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('survey')
@Controller('survey')
export class SurveyController {
    constructor(private readonly surveyService: SurveyService) {}
    

    @Get("get-survey-by-student/:id")
    async getSurveyTeacher(@Param('id') id: number) {
        return this.surveyService.getSurveysTeacherByStudent(id);
    }

    @Get("get-questions/:id")
    async getSurveyQuestion(@Param('id') id: number) {
        return this.surveyService.getSurveyQuestionBySurveyId(id);
    }

    @Get("get-teacher-questions/:id")
    async getSurveyTeacherQuestion(@Param('id') id: number) {
        return this.surveyService.getSurveyTeacherQuestionsBySurveyTeacherId(id);
    }

    @Post("add-teacher_answer")
    async createTeacherAnswer(@Body() data: any) {
        return this.surveyService.createTeacherAnswer(data);
    }

    @Post("add-answer")
    async createAnswer(@Body() data: any) {
        return this.surveyService.createAnswer(data);
    }
}

