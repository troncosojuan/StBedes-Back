import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber } from "class-validator";

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

    @ApiProperty({ type: [{ question_id: Number }] })
    @IsArray()
    survey_teacher_question: { question_id: number }[];
}