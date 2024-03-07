import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

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
}

export class CreateStudentByYearDto {
    @ApiProperty()
    @IsNumber()
    student_id: number;
    @ApiProperty()
    @IsNumber()
    year_id: number;
}

export class CreateFamilyDto {
    @ApiProperty()
    @IsNumber()
    parent_id: number;
    
    @ApiProperty()
    @IsNumber()
    student_id: number;

    @ApiProperty()
    @IsString()
    last_update_api_date: string;
}


export class CreateParentDto {
    @ApiProperty()
    @IsNumber()
    parent_id: number;
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
    relationship_raw: string;
    @ApiProperty()
    @IsString()
    parental_responsibility: string;
    @ApiProperty()
    @IsString()
    parental_responsibility_contact_type: string;
    @ApiProperty()
    @IsString()
    last_update_api_date: string;
    @ApiProperty()
    @IsBoolean()
    is_first_person_contact: boolean;
    @ApiProperty()
    @IsNumber()
    contact_id: number;
    @ApiProperty()
    @IsString()
    telephone: string;
    @ApiProperty()
    @IsString()
    email_address: string;
    @ApiProperty()
    @IsString()
    pupil_status: string;
    @ApiProperty()
    @IsString()
    password: string;

}
