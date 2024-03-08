import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";


export class CreateSurveyTeacherAnswerAndRelationDto{
    @ApiProperty()
    @IsNumber()
    student_has_survey_teacher: number;
    @ApiProperty()
    CreateSurveyTeacherAnswerDto: CreateSurveyTeacherAnswerDto[];
}

export class CreateSurveyTeacherDto{
    @ApiProperty()
    @IsNumber()
    set_id: number;

    @ApiProperty()
    @IsNumber()
    teacher_id: number;

    @ApiProperty({ type: [Number] })
    @IsArray()
    student_has_survey_teacher: Array<number>;

    @ApiProperty({ type: [Number] })
    @IsArray()
    survey_teacher_question: Array<number>;;
}

export class CreateSurveyTeacherAnswerDto{
    @ApiProperty()
    @IsNumber()
    survey_teacher_question_id: number;
    @ApiProperty()
    @IsNumber()
    student_id: number;
    @ApiProperty()
    @IsString()
    answer: string;
}