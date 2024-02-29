import { Injectable } from '@nestjs/common';
import { CreateSetDto } from './dto/createSet.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SetService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createTeacherDto: CreateSetDto) {
    await this.prismaService.set.create({
      data: createTeacherDto
    });
  }
  async createMany(createSetDto: CreateSetDto[]) {
    await this.prismaService.set.createMany({
      data: createSetDto
    });
  }
}
