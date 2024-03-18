import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserStudentDto } from './dto/user.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiResponse({ status: 200, description: "User logged in successfully" })
  async login(@Body() data: LoginUserStudentDto) {
    return await this.authService.login(data);
  }
}
