import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SurveyStateService } from './survey_state.service';
@Controller('survey-state')
export class SurveyStateController {
    constructor(private readonly surveyStateService : SurveyStateService) {}

    @Get('all/status')
    @ApiResponse({ status: 201, description: "Subjects retrieved successfully" })
    async getAllSubjectsStatus() {
        return await this.surveyStateService.get()
    }

    @Post('set')
    @ApiResponse({ status: 201, description: "Subjects retrieved successfully" })
    async setAllSubjectsStatus(@Body() body) {
        return await this.surveyStateService.set(body)
    }
}
