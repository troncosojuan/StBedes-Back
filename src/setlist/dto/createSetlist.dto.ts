import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

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
}