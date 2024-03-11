import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {

  constructor(private readonly prisma: PrismaService) { }


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
    doc.fontSize(25).text(`Whole School Pupil Voice - ${monthYear}`, { align: 'center', undefined });

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


  async getSubjectReport(id: number) {
    // Obtener la lista de sets y la cantidad de estudiantes
    const sets = await this.prisma.set.findMany({
      where: {
        subject_id: id,
      },
      select: {
        set_code: true,
        set_list: {
          select: {
            student_id: true,
          },
        },
      },
    });
  
    // Crear un array para almacenar el resultado final
    const result = [];
  
    // Recorrer cada conjunto y calcular la cantidad de estudiantes
    for (const set of sets) {
      const setCode = set.set_code;
      const studentCount = set.set_list.length;
  
      // Obtener la cantidad de encuestas contestadas para las preguntas especificadas
      const surveyCounts = await this.prisma.survey_teacher_question_answer.aggregate({
        where: {
          survey_teacher_question_id: {
            in: [1, 2, 3, 4, 5], // IDs de las preguntas especificadas
          },
        },
        _count: {
          survey_teacher_question_id: true,
        },
      });
  
      // Calcular el porcentaje de encuestas contestadas para cada pregunta
      const totalSurveys = surveyCounts._count.survey_teacher_question_id;
      const surveyPercentages = (totalSurveys / studentCount) * 100;
  
      // Calcular el promedio de Agree y Agree and Not Agree contestadas del total
      for (let i = 1; i <= 5; i++) {
        const agreeCounts = await this.prisma.survey_teacher_question_answer.aggregate({
          where: {
            survey_teacher_question_id: i,
            answer: {
              in: ["Agree"],
            },
          },
          _count: {
            answer: true,
          },
        });
  
        const agreeAndNotSureCounts = await this.prisma.survey_teacher_question_answer.aggregate({
          where: {
            survey_teacher_question_id: i,
            answer: {
              in: ["Agree", "Not Sure"],
            },
          },
          _count: {
            answer: true,
          },
        });
  
        const totalAgree = agreeCounts._count.answer;
        const totalAgreePercentage = (totalAgree / studentCount) * 100;
        const totalAgreeAndNotSure = agreeAndNotSureCounts._count.answer;
        const totalAgreeAndNotSurePercentage = (totalAgreeAndNotSure / studentCount) * 100;
  
        // Agregar la información de la pregunta al resultado final
        result.push({
          setCode,
          studentCount,
          questionId: i,
          totalAgreePercentage,
          totalAgreeAndNotSurePercentage
        });
      }
      const agreeCounts = await this.prisma.survey_teacher_question_answer.aggregate({
        where: {
          survey_teacher_question_id: {
            in: [1, 2, 3, 4, 5], // IDs de las preguntas especificadas
          },
          answer: {
            in: ["Agree"],
          },
        },
        _count: {
          answer: true,
        },
      });

      const agreeAndNotSureCounts = await this.prisma.survey_teacher_question_answer.aggregate({
        where: {
          survey_teacher_question_id: {
            in: [1, 2, 3, 4, 5], // IDs de las preguntas especificadas
          },
          answer: {
            in: ["Agree", "Not Sure"],
          },
        },
        _count: {
          answer: true,
        },
      });
  
      const totalAgree = agreeCounts._count.answer;
      const totalAgreePercentage = (totalAgree / studentCount) * 100;
      const totalAgreeAndNotSure = agreeAndNotSureCounts._count.answer;
      const totalAgreeAndNotSurePercentage = (totalAgreeAndNotSure / studentCount) * 100;
  
      // Agregar la información del conjunto al resultado final
      
    }
  
    return result;
  }

}
