import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }


  @Get("get-whole-college-report")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getWholeSubjectReport() {
    return await this.reportService.getWholeCollegeResponses();
  }

  @Get("get-subject-report/:id")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getSubjectReport(@Param("id") id: number) {
    return await this.reportService.getSubjectReport(id);
  }

  @Get("get-subject-report-by-subject/:id")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getSubjectReportBySubject(@Param("id") id: number) {
    return await this.reportService.getSubjectReportWithTeacher(id);
  }

  @Get("get-teacher-report/:id")
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
