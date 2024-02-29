import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateStudentDto {
    @ApiProperty()
    @IsNumber()
    student_id: number;
    @ApiProperty()
    @IsNumber()
    person_id: number;
    @ApiProperty()
    @IsNumber()
    family_id: number;
    @ApiProperty()
    @IsString()
    title: string;
    @ApiProperty()
    @IsString()
    forename: string;
    @ApiProperty()
    @IsString()
    surname: string;
    @ApiProperty()
    @IsString()
    middle_name: string;
    @ApiProperty()
    @IsString()
    initials: string;
    @ApiProperty()
    @IsString()
    preferred_name: string;
    @ApiProperty()
    @IsString()
    fullname: string;
    @ApiProperty()
    @IsString()
    gender: string;
    @ApiProperty()
    @IsString()
    form: string;
    @ApiProperty()
    @IsString()
    email_address: string;
    @ApiProperty()
    @IsString()
    pupil_type: string;
    @ApiProperty()
    @IsString()
    enrolment_date: string;
    @ApiProperty()
    @IsNumber()
    enrolment_school_year: number;
    @ApiProperty()
    @IsString()
    password: string;

    //   set_list: SetListDto[];
    //   student_by_year: StudentByYearDto[];
    //   survey_teacher_question_answer: SurveyTeacherQuestionAnswerDto[];
    //   student_has_survey_teacher: StudentHasSurveyTeacherDto[];
    //   student_has_survey: StudentHasSurveyDto[];


}