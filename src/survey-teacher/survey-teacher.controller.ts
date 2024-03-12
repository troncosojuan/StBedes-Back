import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveyTeacherService } from './survey-teacher.service';
import { CreateSurveyTeacherAnswerAndRelationDto, CreateSurveyTeacherDto, CreateSurveyTeacherTriggerDto } from './dto/survey-teacher.dto';
import { ApiResponse } from '@nestjs/swagger';


@Controller('survey-teacher')
export class SurveyTeacherController {
  constructor(private readonly surveyTeacherService: SurveyTeacherService) {}

  @Get("get-question-teacher-by-survey-teacher/:id")
    @ApiResponse({ status: 200, description: "Survey teacher question retrieved successfully" })
    async getSurveyQuestion(@Param('id') id: number) {
        return await this.surveyTeacherService.getSurveyQuestionBySurveyId(id);
    }

    @Get("get-survey-teacher-by-student/:id")
    @ApiResponse({ status: 200, description: "Survey teacher retrieved successfully" })
    async getSurveyTeacherQuestion(@Param('id') id: number) {
        return await this.surveyTeacherService.getSurveysTeacherByStudent(id);
    }


    @Get("teacher-list-by-student/:id")
    @ApiResponse({ status: 200, description: "Teacher list retrieved successfully" })
    async getTeacherListByStudent(@Param('id') id: number) {
        return await this.surveyTeacherService.getTeacherListByStudent(id);
    }

    
    @Post("add-survey-teacher")
    @ApiResponse({ status: 201, description: "Survey teacher created successfully" })
    async createSurveyTeacher(@Body() data: CreateSurveyTeacherDto[]) {
        await this.surveyTeacherService.createSurveyTeacher(data);
    }

    @Post("add-answer-teacher")
    @ApiResponse({ status: 201, description: "Survey teacher answer created successfully" })
    async createTeacherAnswer(@Body() data: CreateSurveyTeacherAnswerAndRelationDto) {
        await this.surveyTeacherService.createTeacherAnswer(data);
    }

    @Post("add-survey-teacher-trigger")
    @ApiResponse({ status: 201, description: "Survey teacher trigger created successfully" })
    async createSurveyTeacherTrigger(@Body() data: CreateSurveyTeacherTriggerDto[]) {
        await this.surveyTeacherService.createSurveyTeacherTrigger(data);
    }


}
