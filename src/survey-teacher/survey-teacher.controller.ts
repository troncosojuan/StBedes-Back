import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveyTeacherService } from './survey-teacher.service';
import { CreateSurveyTeacherAnswerAndRelationDto, CreateSurveyTeacherDto } from './dto/survey-teacher.dto';


@Controller('survey-teacher')
export class SurveyTeacherController {
  constructor(private readonly surveyTeacherService: SurveyTeacherService) {}

  @Get("get-question-teacher-by-survey-teacher/:id")
    async getSurveyQuestion(@Param('id') id: number) {
        return await this.surveyTeacherService.getSurveyQuestionBySurveyId(id);
    }

    @Get("get-survey-teacher-by-student/:id")
    async getSurveyTeacherQuestion(@Param('id') id: number) {
        return await this.surveyTeacherService.getSurveysTeacherByStudent(id);
    }


    @Get("teacher-list-by-student/:id")
    async getTeacherListByStudent(@Param('id') id: number) {
        return await this.surveyTeacherService.getTeacherListByStudent(id);
    }

    
    @Post("add-survey-teacher")
    async createSurveyTeacher(@Body() data: CreateSurveyTeacherDto[]) {
        await this.surveyTeacherService.createSurveyTeacher(data);
    }

    @Post("add-answer-teacher")
    async createTeacherAnswer(@Body() data: CreateSurveyTeacherAnswerAndRelationDto) {
        await this.surveyTeacherService.createTeacherAnswer(data);
    }


}
