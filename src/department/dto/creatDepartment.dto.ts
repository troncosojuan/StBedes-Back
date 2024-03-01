import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreatDepartmentDto {
    @ApiProperty()
    @IsNumber()
    department_id: number;
    @ApiProperty()
    @IsString()
    department_name: string;
    @ApiProperty()
    last_update_api_date: Date;
}