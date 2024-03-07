import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

@Injectable()
export class ReportService {

  

  async generateReport(res: Response) {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    doc.pipe(fs.createWriteStream('report.pdf'));

    const questions = [
      'Homework - I find homework is worthwhile and helps me become more confident in the subject',
      'Feedback - My teacher gives me regular feedback (either verbal or written) and I know what I need to do to improve',
      'Support - I feel I get enough support and I know where to go to get extra help',
      'Progress - I feel I understand the subject and learn something in each lesson',
      'Love of Learning - Even if lessons are difficult or I don’t like what we are learning about, the teacher inspires me and I grow in confidence',
    ];

    const currentDate = new Date();
    const monthYear = currentDate.toLocaleString('en-us', { month: 'long', year: 'numeric' });
    doc.fontSize(25).text(`Whole School Pupil Voice - ${monthYear}`, { align: 'center' , undefined});
    
    doc.moveDown().fontSize(12).text('Pupils were asked five questions about each of their subjects:');

    questions.forEach((question, index) => {
      const parts = question.split(' '); // Dividir la pregunta en palabras
      if (parts.length > 0) {
        const firstWord = parts[0]; // Obtener la primera palabra
        const restOfQuestion = parts.slice(1).join(' '); // Unir el resto de la pregunta
        doc.moveDown().fontSize(12).text('\u2756 ', { continued: true }).text(firstWord, { bold: true }).text(restOfQuestion);
      }
    });
    
    doc.end();
  }
}
