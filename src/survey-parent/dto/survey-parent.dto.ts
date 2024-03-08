import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateSurveyParentAnswerDto{
    @ApiProperty()
    @IsNumber()
    survey_parent_question_id: number;
    @ApiProperty()
    @IsNumber()
    student_id: number;
    @ApiProperty()
    @IsString()
    answer: string;
}

export class CreateSurveyParentDto{
    @ApiProperty({ type: [Number] })
    @IsArray()
    survey_parent_question: Array<number>;
}


export class CreateSurveyParentAnswerAndRelationDto{
    @ApiProperty()
    @IsNumber()
    parent_has_survey_parent_id: number;
    @ApiProperty()
    createSurveyParentAnswerDto: CreateSurveyParentAnswerDto[];
}