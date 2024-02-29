import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/createStudent.dto';

@ApiTags('student')
@Controller('student')
export class StudentController {

    constructor(private readonly studentService: StudentService) { }

    @Post('createMany')
    @ApiResponse({ status: 201, description: "Students created successfully" })
    async createMany(@Body() createStudentDto: CreateStudentDto[]) {
        await this.studentService.createMany(createStudentDto);
    }

    @Post('create')
    @ApiResponse({ status: 201, description: "Student created successfully" })
    async create(@Body() createStudentDto: CreateStudentDto) {
        await this.studentService.create(createStudentDto);
    }

}
