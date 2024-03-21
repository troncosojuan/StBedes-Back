import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express'; // Import the Response type from the express package
import { ReportService } from './report.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }


  @Get("get-subject-report")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getWholeSubjectReport() {
    return await this.reportService.getWholeCollegeResponses();
  }

  @Get("get-teacher-report")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getWholeTeacherReport(@Param("id") id: number) {
    return await this.reportService.getSubjectReport(id);
  }

  @Get("get-subject-report-by-subject/:id")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getSubjectReport(@Param("id") id: number) {
    return await this.reportService.getSubjectReportWithTeacher(id);
  }

  @Get("get-teacher-report")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getTeacherReport(@Param("id") id: number) {
    return await this.reportService.getTeacherReport(id)
  }


  @Get("get-teacher-report-by-teacher/:id")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getTeacherReportByTeacher(@Param("id") id: number) {
    return await this.reportService.getTeacherReportWithSubject(id);
  }

}
