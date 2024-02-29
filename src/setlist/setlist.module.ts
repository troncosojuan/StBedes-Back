import { Module } from '@nestjs/common';
import { SetlistService } from './setlist.service';
import { SetlistController } from './setlist.controller';

@Module({
  controllers: [SetlistController],
  providers: [SetlistService],
})
export class SetlistModule {}
