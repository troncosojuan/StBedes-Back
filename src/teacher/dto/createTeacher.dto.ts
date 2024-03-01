import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateTeacherDto {
    
    @ApiProperty()
    @IsNumber()
    staff_id: number;
    @ApiProperty()
    @IsNumber()
    person_id: number;
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
    middle_names: string;
    @ApiProperty()
    @IsString()
    initials: string;
    @ApiProperty()
    @IsString()
    preferred_name: string;
    @ApiProperty()
    @IsString()
    full_name: string;
    @ApiProperty()
    @IsString()
    gender: string;
    @ApiProperty()
    @IsString()
    school_email_address: string;
}