import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateSubjectDto {
    @ApiProperty()
    @IsNumber()
    subject_id: number;
    @ApiProperty()
    @IsString()
    subject_name: string;
    @ApiProperty()
    @IsBoolean()
    is_include: boolean;
    @ApiProperty()
    @IsNumber()
    department_id: number;
    @ApiProperty()
    @IsString()
    last_update_api_date: string;
}