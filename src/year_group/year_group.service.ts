import { Injectable } from '@nestjs/common';
import { CreateYearGroupDto } from './dto/createYearGroup.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class YearGroupService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createYearGroupDto: CreateYearGroupDto) {
    await this.prismaService.year_group.create({
      data: createYearGroupDto
    });
  }
  async createMany(createYearGroupDto: CreateYearGroupDto[]) {
    await this.prismaService.year_group.createMany({
      data: createYearGroupDto
    });
  }
}
