import { Body, Controller, Post } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatDepartmentDto } from './dto/creatDepartment.dto';


@ApiTags('department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post('createMany')
  @ApiResponse({ status: 201, description: "Departments created successfully" })
  async createMany(@Body() createDepartmentDto: CreatDepartmentDto[]) {
    await this.departmentService.createMany(createDepartmentDto);
  }

  @Post('create')
  @ApiResponse({ status: 201, description: "Department created successfully" })
  async create(@Body() createStudentDto: CreatDepartmentDto) {
    await this.departmentService.create(createStudentDto);
  }


}
