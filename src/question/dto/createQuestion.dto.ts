import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreatQuestionDto {

    @ApiProperty()
    @IsNumber()
    question_id: number;
    @ApiProperty()
    @IsString()
    section: string;
    @ApiProperty()
    @IsString()
    title: string;
    @ApiProperty()
    @IsString()
    content: string;
    @ApiProperty()
    @IsNumber()
    type: number;
    @ApiProperty()
    @IsNumber()
    question_type_id: number;
}