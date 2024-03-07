import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express'; // Import the Response type from the express package
import { ReportService } from './report.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get("generate-report")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async generateReport(@Res() res: Response<any, Record<string, any>>) { // Use the Response type for the res parameter
    return this.reportService.generateReport(res);
  }
}
