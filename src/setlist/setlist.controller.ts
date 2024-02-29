import { Body, Controller, Post } from '@nestjs/common';
import { SetlistService } from './setlist.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSetlistDto } from './dto/createSetlist.dto';

@ApiTags('setlist')
@Controller('setlist')
export class SetlistController {
  constructor(private readonly setlistService: SetlistService) { }

  @Post('createMany')
  @ApiResponse({ status: 201, description: "Students created successfully" })
  async createMany(@Body() createSetlistDto: CreateSetlistDto[]) {
    await this.setlistService.createMany(createSetlistDto);
  }

  @Post('create')
  @ApiResponse({ status: 201, description: "Student created successfully" })
  async create(@Body() createSetlistDto: CreateSetlistDto) {
    await this.setlistService.create(createSetlistDto);
  }
}
