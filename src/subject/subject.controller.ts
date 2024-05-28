import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSubjectDto } from './dto/createSubject';


@ApiTags('subject')
@Controller('subject')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) { }

    @Post('createMany')
    @ApiResponse({ status: 201, description: "Subjects created successfully" })
    async createMany(@Body() createSubjectDto: CreateSubjectDto[]) {
        await this.subjectService.createMany(createSubjectDto);
    }

    @Post('create')
    @ApiResponse({ status: 201, description: "Subject created successfully" })
    async create(@Body() createSubjectDto: CreateSubjectDto) {
        await this.subjectService.create(createSubjectDto);
    }

    @Get('all/status')
    @ApiResponse({ status: 201, description: "Subjects retrieved successfully" })
    async getAllSubjectsStatus() {
        return await this.subjectService.getAllSubjectsStatus();
    }

    @Post('set/status')
    @ApiResponse({ status: 201, description: "Subjects setted successfully" })
    async setAllSubjectsStatus(@Body() subjects) {
        return await this.subjectService.setAllSubjectsStatus(subjects);
    }
    
}
