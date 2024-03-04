import { Body, Controller, Post } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTeacherBySetDto, CreateTeacherDto } from './dto/createTeacher.dto';

@ApiTags('teacher')
@Controller('teacher')
export class TeacherController {

    constructor(private readonly teacherService: TeacherService) { }

    @Post('createMany')
    @ApiResponse({ status: 201, description: "Teachers created successfully" })
    async createMany(@Body() createTeacherDto: CreateTeacherDto[]) {
        await this.teacherService.createMany(createTeacherDto);
    }

    @Post('create')
    @ApiResponse({ status: 201, description: "Teachers created successfully" })
    async create(@Body() createTeacherDto: CreateTeacherDto) {
        await this.teacherService.create(createTeacherDto);
    }

    @Post("create-teacherBySet")
    @ApiResponse({ status: 201, description: "Teachers created successfully" })
    async createTeacherBySet(@Body() createTeacherDto: CreateTeacherBySetDto[]) {
        await this.teacherService.createTeacherBySet(createTeacherDto);
    }

}
