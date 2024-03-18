import { Injectable, NotFoundException } from '@nestjs/common';
import { userInfo } from 'os';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto, LoginUserStudentDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {


    constructor(private readonly prisma: PrismaService) { }

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

    async loginParent(data: LoginUserDto) {
        const user = await this.prisma.parent.findFirst({
            where: {
                email_address: data.email,
                password: data.password
            }
        });

        if (!user) {
            throw new NotFoundException('Parent not found');
        }
    }


    async loginStudent(data: LoginUserDto) {
        const user = await this.prisma.student.findFirst({
            where: {
                email_address: data.email,
                password: data.password
            }
        });

        if (!user) {
            throw new NotFoundException('Student not found');
        }

        const userDto = plainToClass(LoginUserDto, user);

        return userDto;
    }


}
