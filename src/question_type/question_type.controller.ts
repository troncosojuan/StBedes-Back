import { Controller } from '@nestjs/common';
import { QuestionTypeService } from './question_type.service';

@Controller('question-type')
export class QuestionTypeController {
  constructor(private readonly questionTypeService: QuestionTypeService) {}
}
