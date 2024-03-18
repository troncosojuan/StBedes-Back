import { Injectable, NotFoundException } from '@nestjs/common';
import { userInfo } from 'os';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserStudentDto } from './dto/user.dto';

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService) {}

  async login(data: LoginUserStudentDto) {
     const userInfo = await this.prisma.student.findFirst({
        where: {
            email_address: data.email_address
  }
    });
   
    if (!userInfo) {
      new NotFoundException('User not found');
    }

  }
}
