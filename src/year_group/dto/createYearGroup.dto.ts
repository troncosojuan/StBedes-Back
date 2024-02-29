import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateYearGroupDto {
    @ApiProperty()
    @IsNumber()
    year_id: number;
    @ApiProperty()
    @IsString()
    name: string;
}