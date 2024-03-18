import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUserStudentDto {
    @ApiProperty()
    @IsString()
    email_address: string;
}