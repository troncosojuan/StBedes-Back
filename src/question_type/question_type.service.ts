import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionType } from './dto/createQuestionType.dto';

@Injectable()
export class QuestionTypeService {

  constructor(private readonly prismaService: PrismaService) {}

  async createMany(createQuestionTypeDto: CreateQuestionType[]) {
    return await this.prismaService.question_type.createMany({
      data: createQuestionTypeDto
    });
  }
}
