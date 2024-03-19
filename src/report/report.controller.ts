import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express'; // Import the Response type from the express package
import { ReportService } from './report.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}


  @Get("get-subject-report")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getWholeSubjectReport() { // Use the Response type for the res parameter
    return this.reportService.getWholeCollegeResponses();
  }

  @Get("get-subject-report-by-subject/:id")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getSubjectReport(@Param("id") id:number ) { // Use the Response type for the res parameter
    const subjectReport = await this.reportService.getSubjectReport(id);
    const subjectReportWithTeacher = await this.reportService.getSubjectReportWithTeacher(id);

    return {subjectReport, subjectReportWithTeacher};
  }


  @Get("get-teacher-report-by-teacher/:id")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getTeacherReport(@Param("id") id:number) { // Use the Response type for the res parameter
    // const teacherReport = await this.reportService.getTeacherReport(id);
    const teacherReportWithSubject = await this.reportService.getTeacherReportWithSubject(id);

    return teacherReportWithSubject;
  }

  
  
  
}
