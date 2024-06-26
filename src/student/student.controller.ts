import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateFamilyDto, CreateParentDto, CreateStudentByYearDto, CreateStudentDto } from './dto/createStudent.dto';

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

    @Post("create-studentByYear")
    @ApiResponse({ status: 201, description: "Students created successfully" })
    async createStudentByYear(@Body() createStudentDto: CreateStudentByYearDto[]) {
        await this.studentService.createStudentByYear(createStudentDto);
    }

    @Post("create-family")
    @ApiResponse({ status: 201, description: "Families created successfully" })
    async createFamily(@Body() createFamilyDto: CreateFamilyDto[]) {
        await this.studentService.createFamily(createFamilyDto);
    }


    @Post("create-parent")
    @ApiResponse({ status: 201, description: "Parents created successfully" })
    async createParent(@Body() createParentDto: CreateParentDto[]) {
        await this.studentService.createParent(createParentDto);
    }

}
