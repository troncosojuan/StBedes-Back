import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateSetlistDto {
    @ApiProperty()
    @IsNumber()
    set_list_id: number;
    @ApiProperty()
    @IsNumber()
    set_id: number;
    @ApiProperty()
    @IsNumber()
    student_id: number;
    @ApiProperty()
    @IsString()
    last_update_api_date: string;
}