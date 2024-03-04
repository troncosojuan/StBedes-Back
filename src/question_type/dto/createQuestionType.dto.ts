import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateQuestionType {
    @ApiProperty()
    @IsNumber()
    question_type_id: number;
    @ApiProperty()
    @IsString()
    options: string;
    @ApiProperty()
    @IsString()
    type: string;
}