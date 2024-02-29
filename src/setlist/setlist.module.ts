import { Module } from '@nestjs/common';
import { SetlistService } from './setlist.service';
import { SetlistController } from './setlist.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SetlistController],
  providers: [SetlistService, PrismaService],
})
export class SetlistModule {}
