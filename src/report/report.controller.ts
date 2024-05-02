import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }


  @Get("get-teacher-report-pdf/:id")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getTeacherReportPdf(@Param("id") id: number,   @Res() res: any) {
    const { buffer, fileName } = await this.reportService.getTeacherReportPDF(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`); // Asegura que el PDF se descargue con el nombre adecuado
    res.setHeader('X-Filename', fileName);
    res.send(buffer);
  }

  @Get("get-subject-report-pdf/:id")
  @ApiResponse({ status: 200, description: "Report generated successfully" })
  async getSubjectReportPdf(@Param("id") id: number,   @Res() res: any) {
    const { buffer, fileName } = await this.reportService.getSubjectReportPDF(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`); // Asegura que el PDF se descargue con el nombre adecuado
    res.setHeader('X-Filename', fileName);
    res.send(buffer);
  }


}
