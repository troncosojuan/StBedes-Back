import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateSurveyAnswerDto, CreateSurveyDto, CreateSurveyParentAnswerDto, CreateSurveyParentDto, CreateSurveyTeacherAnswerDto, CreateSurveyTeacherDto } from './dto/createSurvey.dto';

@ApiTags('survey')
@Controller('survey')
export class SurveyController {
    constructor(private readonly surveyService: SurveyService) {}
    
    // @Get("get-survey-by-student/:id")
    // async getSurveyTeacher() {
    //     return await this.surveyService.getSurveyByStudent();
    // }

    // @Get("get-survey-teacher/:id")
    // async getSurveyQuestion(@Param('id') id: number) {
    //     await this.surveyService.getSurveyQuestionBySurveyId(id);
    // }

    @Get("get-teacher-questions/:id")
    async getSurveyTeacherQuestion(@Param('id') id: number) {
        return await this.surveyService.getSurveysTeacherByStudent(id);
    }

    @Post("add-teacher-answer")
    async createTeacherAnswer(@Body() data: CreateSurveyTeacherAnswerDto[]) {
        await this.surveyService.createTeacherAnswer(data);
    }

    @Post("add-answer")
    async createAnswer(@Body() data: CreateSurveyAnswerDto[]) {
        await this.surveyService.createAnswer(data);
    }

    @Post("add-survey")
    async createSurvey(@Body() data: CreateSurveyDto[]) {
        await this.surveyService.createSurvey(data);
    }

    @Post("add-survey-teacher")
    async createSurveyTeacher(@Body() data: CreateSurveyTeacherDto[]) {
        await this.surveyService.createSurveyTeacher(data);
    }

    @Post("add-parent-answer")
    async createParentAnswer(@Body() data: CreateSurveyParentAnswerDto[]) {
        await this.surveyService.createParentAnswer(data);
    }




    @Post("add-survey-parent")
    async createSurveyParent(@Body() data: CreateSurveyParentDto[]) {
        await this.surveyService.createSurveyParent(data);
    }

}

