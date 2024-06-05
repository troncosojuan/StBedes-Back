import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsString } from "class-validator";

export class LoginUserStudentDto {
    @ApiProperty()
    @IsString()
    email_address: string;
}

export class LoginUserDto{
    @ApiProperty()
    @IsString()
    email: string;
    @ApiProperty()
    @IsString()
    password: string;
}

export class ParentDto{
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
    @IsString()
    is_first_person_contact: string;
    @ApiProperty()
    @IsString()
    contact_id: string;
    @ApiProperty()
    @IsString()
    telephone: string;
    @ApiProperty()
    @IsString()
    email_address: string;
    @ApiProperty()
    @IsString()
    pupil_status: string;
}

export class StudentDto{
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
    @IsString()
    enrolment_school_year: string;
    @Exclude()
    password: string;

    @Exclude()
    created_at: string;
}


