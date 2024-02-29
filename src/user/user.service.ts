import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;
@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}
    
    async create(createUserDto: CreateUserDto) {
        return await this.prismaService.user.create({
            data: {
                email: createUserDto.email,
                password: await bcrypt.hash(createUserDto.password, roundsOfHashing),
            }
        });
    }
    async findOne(userId: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
    }

    findAll() {
      throw new Error('Method not implemented.');
    }

}
