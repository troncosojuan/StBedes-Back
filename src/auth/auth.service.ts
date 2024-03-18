import { Injectable, NotFoundException } from '@nestjs/common';
import { userInfo } from 'os';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService) {}

  async login(data: string) {
     const userInfo = await this.prisma.student.findFirst({
        where: {
            email_address: data
  }
    });
   
    if (!userInfo) {
      new NotFoundException('User not found');
    }

  }
}
