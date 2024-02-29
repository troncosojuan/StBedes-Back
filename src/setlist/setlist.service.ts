import { Injectable } from '@nestjs/common';
import { CreateSetlistDto } from './dto/createSetlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SetlistService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createSetlistDto: CreateSetlistDto) {
    await this.prismaService.set_list.create({
      data: createSetlistDto
    });
  }
  async createMany(createSetlistDto: CreateSetlistDto[]) {
    await this.prismaService.set_list.createMany({
      data: createSetlistDto
    });
  }
}
