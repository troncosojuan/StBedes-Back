import { Module } from '@nestjs/common';
import { YearGroupService } from './year_group.service';
import { YearGroupController } from './year_group.controller';

@Module({
  controllers: [YearGroupController],
  providers: [YearGroupService],
})
export class YearGroupModule {}
