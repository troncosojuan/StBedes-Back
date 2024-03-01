import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateSetDto {
    @ApiProperty()
    @IsNumber()
    set_id: number;
    @ApiProperty()
    @IsNumber()
    subject_id: number;
    @ApiProperty()
    @IsNumber()
    year_id: number;
    @ApiProperty()
    @IsString()
    set_code: string;
    @ApiProperty()
    @IsBoolean()
    is_included: boolean;
    @ApiProperty()
    @IsString()
    last_update_api_date: string;
}