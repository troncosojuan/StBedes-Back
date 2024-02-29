import { Controller } from '@nestjs/common';
import { QuestionTypeService } from './question_type.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('question-type')
@Controller('question-type')
export class QuestionTypeController {
  constructor(private readonly questionTypeService: QuestionTypeService) {}
}
