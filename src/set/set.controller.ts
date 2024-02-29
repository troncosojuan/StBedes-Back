import { Body, Controller, Post } from '@nestjs/common';
import { SetService } from './set.service';
import { ApiResponse } from '@nestjs/swagger';
import { CreateSetDto } from './dto/createSet.dto';


@Controller('set')
export class SetController {
  constructor(private readonly setService: SetService) {}

  @Post('createMany')
  @ApiResponse({ status: 201, description: "Students created successfully" })
  async createMany(@Body() createSetDto: CreateSetDto[]) {
      await this.setService.createMany(createSetDto);
  }

  @Post('create')
  @ApiResponse({ status: 201, description: "Student created successfully" })
  async create(@Body() createTeacherDto: CreateSetDto) {
      await this.setService.create(createTeacherDto);
  }

}
