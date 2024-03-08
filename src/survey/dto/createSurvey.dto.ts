import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateSurveyAnswerDto {
    @ApiProperty()
    @IsNumber()
    survey_question_id: number;
    @ApiProperty()
    @IsNumber()
    student_id: number;
    @ApiProperty()
    @IsString()
    answer: string;
}

export class CreateSurveyDto {
    @ApiProperty({ type: [Number] })
    @IsArray()
    survey_question: Array<number>;
}

export class CreateSurveyAnswerAndRelationDto{
        @ApiProperty()
        @IsNumber()
        student_has_survey_id: number;
        @ApiProperty()
        createSurveyAnswerDto: CreateSurveyAnswerDto[];
    }


