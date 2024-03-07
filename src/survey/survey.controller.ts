import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSurveyAnswerDto, CreateSurveyDto, CreateSurveyParentAnswerDto, CreateSurveyParentDto, CreateSurveyTeacherAnswerDto, CreateSurveyTeacherDto } from './dto/createSurvey.dto';
import { SurveyByStudentTeacherSubjectDto } from './dto/getSurvey.dto';

@ApiTags('survey')
@Controller('survey')
export class SurveyController {
    constructor(private readonly surveyService: SurveyService) { }

    @Get("get-survey-student")
    async getSurveyTeacher() {
        return await this.surveyService.getSurveyByStudent();
    }

    @Get("get-question-teacher-by-survey-teacher/:id")
    async getSurveyQuestion(@Param('id') id: number) {
        return await this.surveyService.getSurveyQuestionBySurveyId(id);
    }

    @Get("get-survey-teacher-by-student/:id")
    async getSurveyTeacherQuestion(@Param('id') id: number) {
        return await this.surveyService.getSurveysTeacherByStudent(id);
    }

    @Get("teacher-list-by-student/:id")
    async getTeacherListByStudent(@Param('id') id: number) {
        return await this.surveyService.getTeacherListByStudent(id);
    }

    @Get("get-survey-by-parent/:id")
    async getSurveyByParent(@Param('id') id: number) {
        return await this.surveyService.getSurveyByParentId(id);
    }

    @Get("get-question-parent-by-student/:id")
    async getQuestionParent(@Param('id') id: number) {
        return await this.surveyService.getQuestionParentByStudent(id);
    }

    @Post("add-survey")
    async createSurvey(@Body() data: CreateSurveyDto[]) {
        await this.surveyService.createSurvey(data);
    }

    @Post("add-answer")
    async createAnswer(@Body() data: CreateSurveyAnswerDto[]) {
        await this.surveyService.createAnswer(data);
    }

    @Post("add-survey-teacher")
    async createSurveyTeacher(@Body() data: CreateSurveyTeacherDto[]) {
        await this.surveyService.createSurveyTeacher(data);
    }

    @Post("add-answer-teacher")
    async createTeacherAnswer(@Body() data: CreateSurveyTeacherAnswerDto[]) {
        await this.surveyService.createTeacherAnswer(data);
    }

    @Post("add-survey-parent")
    async createSurveyParent(@Body() data: CreateSurveyParentDto[]) {
        await this.surveyService.createSurveyParent(data);
    }

    @Post("add-answer-parent")
    async createParentAnswer(@Body() data: CreateSurveyParentAnswerDto[]) {
        await this.surveyService.createParentAnswer(data);
    }

}

