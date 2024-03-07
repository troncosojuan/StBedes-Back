import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class SurveyByStudentTeacherSubjectDto {
    @ApiProperty()
    @IsNumber()
    student_id: number;
    @ApiProperty()
    @IsNumber()
    teacher_id: number;
    @ApiProperty()
    @IsString()
    subject_name: string;
}