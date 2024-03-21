import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto, LoginUserStudentDto } from './dto/user.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiResponse({ status: 200, description: "User logged in successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async login(@Body() data: LoginUserStudentDto) {
      await this.authService.login(data);
 
  }

  @Post("login-student")
  @ApiResponse({ status: 200, description: "Student logged in successfully" })
  async loginStudent(@Body() data: LoginUserDto) {
    return await this.authService.loginStudent(data);
  }


  @Post("login-parent")
  @ApiResponse({ status: 200, description: "Parent logged in successfully" })
  async loginParent(@Body() data: LoginUserDto) {
    return await this.authService.loginParent(data);
  }
  
}
