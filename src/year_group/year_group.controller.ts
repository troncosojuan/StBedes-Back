import { Body, Controller, Post } from '@nestjs/common';
import { YearGroupService } from './year_group.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateYearGroupDto } from './dto/createYearGroup.dto';


@ApiTags('year-group')
@Controller('year-group')
export class YearGroupController {
  constructor(private readonly yearGroupService: YearGroupService) {}

  @Post('createMany')
    @ApiResponse({ status: 201, description: "Students created successfully" })
    async createMany(@Body() createYearGroupDto: CreateYearGroupDto[]) {
        await this.yearGroupService.createMany(createYearGroupDto);
    }

    @Post('create')
    @ApiResponse({ status: 201, description: "Student created successfully" })
    async create(@Body() createYearGroupDto: CreateYearGroupDto) {
        await this.yearGroupService.create(createYearGroupDto);
    }
}
