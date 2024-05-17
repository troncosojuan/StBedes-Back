import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit-table');
import { PrismaService } from 'src/prisma/prisma.service';

import { join, resolve } from 'path';
import { groupBy } from 'rxjs';
interface YearGroupResponse {
  name: string;
  year_id: number;
  question_id: number;
  cantidad_de_alumnos: number;
  porcentaje_respuestas_agree: number;
  porcentaje_respuestas_agree_not_sure: number;
}

interface ProcessedResponse {
  [key: string]: {
    studentSurveyed: number;
    questions: {
      questionId: number;
      agreePercentage: number;
      agreeAndNotSurePercentage: number;
    }[];
  };
}

interface SubjectTeacherResponse {
  name: string;
  set_code: string;
  surname: string;
  title: string;
  question_id: number;
  cantidad_de_alumnos: number;
  porcentaje_respuestas_agree: number;
  porcentaje_respuestas_agree_not_sure: number;
}

interface ProcessedSubjectResponse {
  [key: string]: {
    teacherName: string;
    years: {
      [key: string]: {
        setCode: string;
        totalStudentSurveyed: number;
        questionResults: {
          questionId: number;
          totalAgree: number;
          totalAgreeAndNotSure: number;
        }[];
      }[];
    };
  };
}

@Injectable()
export class ReportService {

  constructor(private readonly prisma: PrismaService) { }



  async getTeacherReportPDF(id: number): Promise<{ buffer: Buffer; fileName: string }> {

    //Setup para cargar dos tablas por hoja
    let changePage = 0;
    const tablesPerPageSubject = 3
    const tablesPerPageTeacher = 2

    const wholeCollegeResponses = await this.getWholeCollegeResponses();
    const teacherReportResponses = await this.getTeacherReport(id)
    const teacherReportWithTeacherResponses = await this.getTeacherReportWithSubject(id)


    const teacherName = await this.prisma.teacher.findFirst({
      where: {
        staff_id: id
      },
      select: {
        title: true,
        surname: true,
      }
    })

    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "LETTER",
        bufferPages: true,
        autoFirstPage: false,
        margin: 50,
      });

      let pageNumber = 0;
      doc.on('pageAdded', () => {
        pageNumber++
        let bottom = doc.page.margins.bottom;

        if (pageNumber > 1) {
          doc.image(join(process.cwd(), "images/logo400x400.jpg"), doc.page.width - 100, 5, { fit: [45, 45], align: 'center' })
          doc.moveTo(50, 55)
            .lineTo(doc.page.width - 50, 55)
            .stroke();
        }

        doc.page.margins.bottom = 0;
        doc.font("Helvetica").fontSize(14);
        doc.text(
          'Page. ' + pageNumber,
          0.5 * (doc.page.width - 100),
          doc.page.height - 50,
          {
            width: 100,
            align: 'center',
            lineBreak: false,
          })
        doc.page.margins.bottom = bottom;
      })

      doc.addPage()
      doc.image(join(process.cwd(), "images/logo400x400.jpg"), doc.page.width / 2 - 100, 50, { width: 200, })
      doc.text('', 0, 300)
      doc.font("Helvetica-Bold").fontSize(40);
      doc.text("Whole School Pupil Voice", {
        width: doc.page.width,
        align: 'center',
        underline: "true"
      });
      doc.moveDown(1);
      doc.text("Department Report", {
        width: doc.page.width,
        align: 'center',
        underline: "true"
      });
      doc.moveDown(1);
      doc.text(`${teacherName.title}. ${teacherName.surname}`, {
        width: doc.page.width,
        align: 'center',
        underline: "true"
      }
      )
      doc.moveDown(0.5)
      doc.text("April 2024", {
        width: doc.page.width,
        align: 'center',
        underline: "true"
      }
      )

      doc.addPage()

      doc.text('', 50, 70);
      doc.moveDown();
      doc.font("Helvetica-Bold").fontSize(32);
      doc.text("Questions", { underline: true });
      doc.moveDown(1);
      // doc.addPage();
      doc.font("Helvetica").fontSize(18);
      // Este texto parece estar correctamente configurado.
      doc.text("Pupils were asked five questions about each of their subjects:", {
        width: doc.page.width - 100,
        align: 'left',
        indent: 10,
      });

      doc.moveDown(2);
      const indentSize = 0; // Tamaño de la identación



      // Lista de elementos de texto
      const items = [
        " Homework - I find homework is worthwhile and helps me become more confident in the subject",
        " Feedback - My teacher gives me regular feedback (either verbal or written) and I know what I need to do to improve",
        " Support - I feel I get enough support and I know where to go to get extra help",
        " Progress - I feel I understand the subject and learn something in each lesson",
        " Love of Learning - Even if lessons are difficult or I don't like what we are learning about, the teacher inspires me and I grow in confidence"
      ];

      // Establecer el tamaño de fuente y la fuente
      doc.fontSize(12).font("Helvetica");


      items.forEach((item, index) => {
        if (index > 0) {
          doc.moveDown(0.5);
        }

        const parts = item.split(' - ');
        if (parts.length === 2) {
          // Agrega negrita a la primera palabra y configura el texto para que continúe en la misma línea.
          doc.font("Helvetica-Bold").text(`${parts[0]} - `, { continued: true, indent: indentSize });
          // Continúa con el texto regular y asegúrate de que no exceda el ancho de la página.
          doc.font("Helvetica").text(parts[1], { indent: indentSize, width: doc.page.width - indentSize * 2 - 50 }); // Resta el doble del indent y algo más para el margen derecho
        } else {
          doc.text(item, { indent: 20, width: doc.page.width - indentSize * 2 - 50 }); // Si no hay guion, solo escribe el texto con el margen correcto
        }
      });

      doc.addPage();
      doc.text('', 50, 70);
      doc.moveDown();



      doc.font("Helvetica-Bold").fontSize(26);
      doc.text("Responses", { underline: true });
      doc.moveDown(1);

      // Tabla de whole college responses
      let rows = [];
      Object.entries(wholeCollegeResponses).forEach(([yearGroup, data]: [string, { studentSurveyed: number; questions: { agreePercentage: number; agreeAndNotSurePercentage: number; }[] }]) => {
        // Asumiendo que data.questions siempre tiene exactamente 5 preguntas, como en el ejemplo dado.
        const totalAgreeRow = [yearGroup, data.studentSurveyed.toString(), 'Agree'];
        const totalAgreeAndNotSureRow = ['', '', 'Agree and Not sure'];

        data.questions.forEach(question => {
          totalAgreeRow.push(`${question.agreePercentage}%`);
          totalAgreeAndNotSureRow.push(`${question.agreeAndNotSurePercentage}%`);
        });

        // Agregar las filas al arreglo de filas.
        rows.push(totalAgreeRow);
        rows.push(totalAgreeAndNotSureRow);
      });

      // Definir la tabla para pdfkit-table
      const tableWholeCollage = {
        title: "Whole College Responses",
        subtitle: "A breakdown of student responses per year group",
        headers: ['Year Group', 'Student Surveyed', 'Answer', 'Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'],
        rows: rows
      };

      // Agregar la tabla al documento
      doc.table(tableWholeCollage, {
        columnsSize: [100, 60, 100, 50, 50, 50, 50, 50],
      });

      doc.addPage(); // Agregar una nueva página
      doc.text('', 50, 70);
      doc.moveDown();



      // Tabla de teacher Report
      Object.entries(teacherReportResponses).forEach(([subject, yearGroups]) => {
        // Crear una tabla para cada materia
        let rows = [];
        Object.entries(yearGroups).forEach(([yearGroup, data]) => {
          const totalAgreeRow = [yearGroup, data.studentSurveyed.toString(), 'Agree'];
          const totalAgreeAndNotSureRow = ['', '', 'Agree and Not sure'];

          data.questions.forEach(question => {
            totalAgreeRow.push(`${question.agreePercentage}%`);
            totalAgreeAndNotSureRow.push(`${question.agreeAndNotSurePercentage}%`);
          });

          // Agregar las filas al arreglo de filas

          rows.push(totalAgreeRow);
          rows.push(totalAgreeAndNotSureRow);

        });

        // Definir la tabla para cada materia
        const table = {
          title: `${subject} Responses`,
          subtitle: "A breakdown of student responses per year group",
          headers: ['Year Group', 'Student Surveyed', 'Answer', 'Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'],
          rows: rows
        };


        // Agregar la tabla al documento
        doc.table(table, {
          columnsSize: [100, 60, 100, 50, 50, 50, 50, 50],
        });

        // Agregar algo de espacio después de cada tabla antes de la siguiente
        doc.moveDown(2);
        changePage++;


        // Verificar si es necesario pasar a la siguiente página
        if (changePage % tablesPerPageSubject === 0) {
          doc.addPage(); // Agregar una nueva página
          doc.text('', 50, 70);
          doc.moveDown();
        }
      });

      // Agregar una nueva página para mostrar datos del teacher
      doc.addPage();
      doc.text('', 50, 70);
      doc.moveDown();
      changePage = 0;




      // Tablas de profesor con el nombre de profesor como titulo y el nombre de la materia como subtitulo
      for (const grade in teacherReportResponses) {
        let rows = [];
        // nombre de materia, 1 tabla por materia
        for (const yearGroup in teacherReportResponses[grade]) {
          // yearGroup, va al final de los sets
          Object.entries(teacherReportWithTeacherResponses).forEach(([teacherName, sets]) => {


            (sets as any[]).forEach(set => {
              if (set.subject === grade && set.yearName === yearGroup) {
                const totalAgreeRow = [set.setCode, set.totalStudentSurveyed.toString(), 'Agree'];
                const totalAgreeAndNotSureRow = ['', '', 'Agree And Not Sure'];

                set.questionResults.forEach(question => {
                  totalAgreeRow.push(`${question.totalAgree}%`);
                  totalAgreeAndNotSureRow.push(`${question.totalAgreeAndNotSure}%`);
                });


                rows.push(totalAgreeRow);
                rows.push(totalAgreeAndNotSureRow);
              }
            })
          })


          const gradeData = teacherReportResponses[grade][yearGroup];
          const totalSurveyed = gradeData.studentSurveyed
          const questionResults = gradeData.questions

          const totalAgreeRowGrade = [yearGroup, totalSurveyed.toString(), 'Agree'];
          const totalAgreeAndNotSureRowGrade = ['', '', 'Agree And NotSure'];

          questionResults.forEach(question => {
            totalAgreeRowGrade.push(`${question.agreePercentage}%`);
            totalAgreeAndNotSureRowGrade.push(`${question.agreeAndNotSurePercentage}%`);
          });

          rows.push(totalAgreeRowGrade);
          rows.push(totalAgreeAndNotSureRowGrade);
        }


        const table = {
          title: `${teacherName.title}. ${teacherName.surname} - ${grade}`,
          headers: ['Year Group', 'Student Surveyed', 'Answer', 'Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'],

          rows: rows
        };

        doc.table(table, {
          columnsSize: [100, 60, 100, 50, 50, 50, 50, 50],
        });

        doc.moveDown(4);
        if (changePage % tablesPerPageTeacher === 0) {
          doc.addPage(); // Agregar una nueva página
          doc.text('', 50, 70);
          doc.moveDown();
        }


      }



      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
      doc.end()
    })

    const fileName = `${teacherName.title}.${teacherName.surname} APR 24.pdf`;
    return { buffer: pdfBuffer, fileName };
  }


  async getSubjectReportPDF(id: number): Promise<{ buffer: Buffer; fileName: string }> {
    const wholeCollegeResponses = await this.getWholeCollegeResponses();
    const subjectReportResponses = await this.getSubjectReport(id);
    const subjectReportWithTeacherResponses = await this.getSubjectReportWithTeacher(id);



    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument(
        {
          size: "LETTER",
          bufferPages: true,
          autoFirstPage: false,

        })

      let pageNumber = 0;
      doc.on('pageAdded', () => {
        pageNumber++
        let bottom = doc.page.margins.bottom;

        if (pageNumber > 1) {
          doc.image(join(process.cwd(), "images/logo400x400.jpg"), doc.page.width - 100, 5, { fit: [45, 45], align: 'center' })
          doc.moveTo(50, 55)
            .lineTo(doc.page.width - 50, 55)
            .stroke();
        }

        doc.page.margins.bottom = 0;
        doc.font("Helvetica").fontSize(14);
        doc.text(
          'Page. ' + pageNumber,
          0.5 * (doc.page.width - 100),
          doc.page.height - 50,
          {
            width: 100,
            align: 'center',
            lineBreak: false,
          })
        doc.page.margins.bottom = bottom;
      })

      doc.addPage()
      doc.image(join(process.cwd(), "images/logo400x400.jpg"), doc.page.width / 2 - 100, 50, { width: 200, })
      doc.text('', 0, 300)
      doc.font("Helvetica-Bold").fontSize(40);
      doc.text("Whole School Pupil Voice", {
        width: doc.page.width,
        align: 'center',
        underline: "true"
      });
      doc.moveDown(1);
      doc.text("Subject Report", {
        width: doc.page.width,
        align: 'center',
        underline: "true"
      });
      doc.moveDown(1);
      doc.text(subjectReportResponses.subject, {
        width: doc.page.width,
        align: 'center',
        underline: "true"
      }
      )
      doc.moveDown(0.5)
      doc.text("April 2024", {
        width: doc.page.width,
        align: 'center',
        underline: "true"
      }
      )

      doc.addPage()

      doc.text('', 50, 70);
      doc.moveDown();
      doc.font("Helvetica-Bold").fontSize(32);
      doc.text("Questions", { underline: true });
      doc.moveDown(1);
      // doc.addPage();
      doc.font("Helvetica").fontSize(18);
      // Este texto parece estar correctamente configurado.
      doc.text("Pupils were asked five questions about each of their subjects:", {
        width: doc.page.width - 100,
        align: 'left',
        indent: 10,
      });

      doc.moveDown(2);
      const indentSize = 0; // Tamaño de la identación



      // Lista de elementos de texto
      const items = [
        " Homework - I find homework is worthwhile and helps me become more confident in the subject",
        " Feedback - My teacher gives me regular feedback (either verbal or written) and I know what I need to do to improve",
        " Support - I feel I get enough support and I know where to go to get extra help",
        " Progress - I feel I understand the subject and learn something in each lesson",
        " Love of Learning - Even if lessons are difficult or I don't like what we are learning about, the teacher inspires me and I grow in confidence"
      ];

      // Establecer el tamaño de fuente y la fuente
      doc.fontSize(12).font("Helvetica");


      items.forEach((item, index) => {
        if (index > 0) {
          doc.moveDown(0.5);
        }

        const parts = item.split(' - ');
        if (parts.length === 2) {
          // Agrega negrita a la primera palabra y configura el texto para que continúe en la misma línea.
          doc.font("Helvetica-Bold").text(`${parts[0]} - `, { continued: true, indent: indentSize });
          // Continúa con el texto regular y asegúrate de que no exceda el ancho de la página.
          doc.font("Helvetica").text(parts[1], { indent: indentSize, width: doc.page.width - indentSize * 2 - 50 }); // Resta el doble del indent y algo más para el margen derecho
        } else {
          doc.text(item, { indent: 20, width: doc.page.width - indentSize * 2 - 50 }); // Si no hay guion, solo escribe el texto con el margen correcto
        }
      });

      doc.addPage();
      doc.text('', 50, 70);
      doc.moveDown();

      doc.font("Helvetica-Bold").fontSize(26);
      doc.text("Responses", { underline: true });
      doc.moveDown(1);
      //Tabla de whole college responses
      let rows: string[][] = [];
      Object.entries(wholeCollegeResponses).forEach(([yearGroup, data]) => {
        const totalAgreeRow: string[] = [yearGroup, data.studentSurveyed.toString(), 'Agree'];
        const totalAgreeAndNotSureRow: string[] = ['', '', 'Agree and Not sure'];

        data.questions.forEach(question => {
          totalAgreeRow.push(`${question.agreePercentage}%`);
          totalAgreeAndNotSureRow.push(`${question.agreeAndNotSurePercentage}%`);
        });

        rows.push(totalAgreeRow);
        rows.push(totalAgreeAndNotSureRow);
      });


      // Definir la tabla para pdfkit-table
      const tableWholeCollage = {
        title: "Whole College Responses",
        subtitle: "A breakdown of student responses per year group",
        headers: ['Year Group', 'Student Surveyed', 'Answer', 'Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'],
        rows: rows
      };

      // Agregar la tabla al documento
      doc.table(tableWholeCollage, {
        columnsSize: [100, 60, 100, 50, 50, 50, 50, 50],
      });

      doc.moveDown(4);
      doc.addPage();
      doc.text('', 50, 70);
      doc.moveDown();

      // Tabla de teacher Report
      const subjectName = subjectReportResponses.subject;

    let rowsSubject = [];
    for (const yearGroup in subjectReportResponses) {
        if (yearGroup !== 'subject') {
            const gradeData = subjectReportResponses[yearGroup];
            const totalSurveyed = gradeData.studentSurveyed;
            const questionResults = gradeData.questions;

            const totalAgreeRow = [yearGroup, totalSurveyed.toString(), 'Agree'];
            const totalAgreeAndNotSureRow = ['', '', 'Agree And Not Sure'];

            questionResults.forEach(question => {
                totalAgreeRow.push(`${question.agreePercentage}%`);
                totalAgreeAndNotSureRow.push(`${question.agreeAndNotSurePercentage}%`);
            });

            rowsSubject.push(totalAgreeRow);
            rowsSubject.push(totalAgreeAndNotSureRow);
        }
    }
      // Definir la tabla para cada materia
      const table = {
        title: `${subjectName} Responses`,
        subtitle: "A breakdown of student responses per year group",
        headers: ['Year Group', 'Student Surveyed', 'Answer', 'Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'],
        rows: rowsSubject
      };


      // Agregar la tabla al documento
      doc.table(table, {
        columnsSize: [100, 60, 100, 50, 50, 50, 50, 50],
      });

      // Agregar algo de espacio después de cada tabla antes de la siguiente
      doc.moveDown(2);

      doc.addPage();
      doc.text('', 50, 70);

      const tablesPerPage = 2;
      let tableCount = 0;

      // Tablas de profesor con el nombre de profesor como titulo y el nombre de la materia como subtitulo
      for (const staffId in subjectReportWithTeacherResponses) {
        const teacherData = subjectReportWithTeacherResponses[staffId];
        const teacherName = teacherData.teacherName;
        let rows = [];

        for (const yearName in teacherData.years) {
          const setsInYear = teacherData.years[yearName];

          for (const set of setsInYear) {
            const totalAgreeRow = [set.setCode, set.totalStudentSurveyed.toString(), 'Agree'];
            const totalAgreeAndNotSureRow = ["", '', 'Agree And Not Sure'];

            // Crear un mapa de los resultados por pregunta
            const questionMap = new Map<number, { totalAgree: number, totalAgreeAndNotSure: number }>();
            set.questionResults.forEach(question => {
              questionMap.set(question.questionId, {
                totalAgree: question.totalAgree,
                totalAgreeAndNotSure: question.totalAgreeAndNotSure,
              });
            });

            // Asegurarse de que cada pregunta del 1 al 5 esté presente en los resultados
            for (let questionId = 1; questionId <= 5; questionId++) {
              if (questionMap.has(questionId)) {
                const question = questionMap.get(questionId);
                totalAgreeRow.push(`${question.totalAgree}%`);
                totalAgreeAndNotSureRow.push(`${question.totalAgreeAndNotSure}%`);
              } else {
                totalAgreeRow.push('0%');
                totalAgreeAndNotSureRow.push('0%');
              }
            }

            rows.push(totalAgreeRow);
            rows.push(totalAgreeAndNotSureRow);
          }

          // Suponiendo que subjectReportResponses es accesible y tiene la data correcta
          if (subjectReportResponses[yearName]) {
            const gradeData = subjectReportResponses[yearName];
            const totalSurveyed = gradeData.studentSurveyed;
            const questionResults = gradeData.questions;

            const totalAgreeRowGrade = [yearName, totalSurveyed.toString(), 'Agree'];
            const totalAgreeAndNotSureRowGrade = ['', '', 'Agree And Not Sure'];

            questionResults.forEach(question => {
              totalAgreeRowGrade.push(question.agreePercentage.toString() + '%');
              totalAgreeAndNotSureRowGrade.push(question.agreeAndNotSurePercentage.toString() + '%');
            });

            rows.push(totalAgreeRowGrade);
            rows.push(totalAgreeAndNotSureRowGrade);
          }
        }

        const table = {
          title: `${teacherName}`,
          headers: ['Set Code', 'Student Surveyed', 'Answer', 'Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'],
          rows: rows,
          autoPageBreak: true,
          prepareRow: (row, indexColumn, indexRow, rectRow) => {
            doc.font("Helvetica").fontSize(8);
            indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? 'blue' : 'green'), 0.15);
          },
        };

        doc.table(table, {
          columnsSize: [100, 60, 100, 50, 50, 50, 50, 50],
        });

        doc.moveDown(1);
        tableCount++;

        if (tableCount % tablesPerPage === 0) {
          doc.addPage();
          doc.text('', 50, 70);
          doc.moveDown();
        }
      }


      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
      doc.end()
    })

    const fileName = `${subjectReportResponses.subject} APR 24.pdf`;
    return { buffer: pdfBuffer, fileName };
  }


  async getWholeCollegeResponses(): Promise<ProcessedResponse> {
    const yearGroupsQuery: YearGroupResponse[] = await this.prisma.$queryRaw`
      select yg."name", yg.year_id, stq.question_id,
        count(distinct stqa.student_id) cantidad_de_alumnos,
        round((sum(case when stqa.answer='Agree' then 1 else 0 end)::float / count(*)::float)*100) as porcentaje_respuestas_agree,
        round((sum(case when stqa.answer<>'Disagree' then 1 else 0 end)::float / count(*)::float)*100) as porcentaje_respuestas_agree_not_sure
      from survey_teacher_question stq
      inner join survey_teacher st ON st.survey_teacher_id = stq.survey_teacher_id
      inner join survey_teacher_question_answer stqa on stqa.survey_teacher_question_id = stq.survey_teacher_question_id
      inner join "set" s on s.set_id = st.set_id
      INNER JOIN student s2 on s2.student_id = stqa.student_id
      inner join year_group yg on yg.year_id = s.year_id
      where st.created_at > '2024-03-17'
      group by 1, 2, 3
      order by yg.year_id
    `;


    // Procesar resultados para convertir BigInt a Number
    const processedResults = yearGroupsQuery.map(entry => ({
      ...entry,
      cantidad_de_alumnos: Number(entry.cantidad_de_alumnos),
      porcentaje_respuestas_agree: Number(entry.porcentaje_respuestas_agree),
      porcentaje_respuestas_agree_not_sure: Number(entry.porcentaje_respuestas_agree_not_sure),
    }));

    // Estructura de datos para los resultados finales
    const result: ProcessedResponse = {};

    processedResults.forEach(entry => {
      const yearName = entry.name;
      const questionId = entry.question_id;

      if (!result[yearName]) {
        result[yearName] = {
          studentSurveyed: entry.cantidad_de_alumnos,
          questions: Array.from({ length: 5 }, (_, i) => ({
            questionId: i + 1,
            agreePercentage: 0,
            agreeAndNotSurePercentage: 0,
          }))
        };
      }

      // Ajustar la cantidad de encuestados si es necesario
      if (result[yearName].studentSurveyed < entry.cantidad_de_alumnos) {
        result[yearName].studentSurveyed = entry.cantidad_de_alumnos;
      }

      result[yearName].questions[questionId - 1].agreePercentage = entry.porcentaje_respuestas_agree;
      result[yearName].questions[questionId - 1].agreeAndNotSurePercentage = entry.porcentaje_respuestas_agree_not_sure;
    });

    return result;
  }



  async getSubjectReportWithTeacher(id: number): Promise<ProcessedSubjectResponse> {
    const subjectTeacherQuery: SubjectTeacherResponse[] = await this.prisma.$queryRaw`
      select yg."name", s.set_code, t.surname, t.title, stq.question_id,
        count(distinct stqa.student_id) as cantidad_de_alumnos,
        round((sum(case when stqa.answer='Agree' then 1 else 0 end)::float / count(*)::float)*100) as porcentaje_respuestas_agree,
        round((sum(case when stqa.answer<>'Disagree' then 1 else 0 end)::float / count(*)::float)*100) as porcentaje_respuestas_agree_not_sure
      from survey_teacher_question stq
      inner join survey_teacher st ON st.survey_teacher_id = stq.survey_teacher_id
      inner join survey_teacher_question_answer stqa on stqa.survey_teacher_question_id = stq.survey_teacher_question_id
      inner join "set" s on s.set_id = st.set_id
      inner join student s2 on s2.student_id = stqa.student_id
      inner join year_group yg on yg.year_id = s.year_id
      inner join subject sub on sub.subject_id = s.subject_id
      inner join teacher t on t.staff_id = st.teacher_id
      where st.created_at > '2024-03-17'
        and sub.subject_id = ${id}
      group by yg."name", s.set_code, t.surname, t.title, stq.question_id, yg.year_id
      order by yg.year_id;
    `;

    // Procesar resultados para convertir BigInt a Number
    const processedResults = subjectTeacherQuery.map(entry => ({
      ...entry,
      cantidad_de_alumnos: Number(entry.cantidad_de_alumnos),
      porcentaje_respuestas_agree: Number(entry.porcentaje_respuestas_agree),
      porcentaje_respuestas_agree_not_sure: Number(entry.porcentaje_respuestas_agree_not_sure),
    }));

    // Estructura de datos para los resultados finales
    const result: ProcessedSubjectResponse = {};

    processedResults.forEach(entry => {
      const teacherKey = entry.surname + '-' + entry.title;
      const yearName = entry.name;

      if (!result[teacherKey]) {
        result[teacherKey] = {
          teacherName: `${entry.title}. ${entry.surname}`,
          years: {},
        };
      }

      if (!result[teacherKey].years[yearName]) {
        result[teacherKey].years[yearName] = [];
      }

      const existingSet = result[teacherKey].years[yearName].find(set => set.setCode === entry.set_code);

      if (!existingSet) {
        result[teacherKey].years[yearName].push({
          setCode: entry.set_code,
          totalStudentSurveyed: entry.cantidad_de_alumnos,
          questionResults: [],
        });
      }

      const currentSet = result[teacherKey].years[yearName].find(set => set.setCode === entry.set_code);
      currentSet.questionResults.push({
        questionId: entry.question_id,
        totalAgree: entry.porcentaje_respuestas_agree,
        totalAgreeAndNotSure: entry.porcentaje_respuestas_agree_not_sure,
      });
    });
    
    return result;
  }

  async getSubjectReport(id: number) {
    const rawResults: any[] = await this.prisma.$queryRaw`
        select yg."name", stq.question_id, sub.subject_name,
            count(distinct stqa.student_id) as cantidad_de_alumnos,
            round((sum(case when stqa.answer='Agree' then 1 else 0 end)::float / count(*)::float)*100) as porcentaje_respuestas_agree,
            round((sum(case when stqa.answer<>'Disagree' then 1 else 0 end)::float / count(*)::float)*100) as porcentaje_respuestas_agree_not_sure
        from survey_teacher_question stq
        inner join survey_teacher st ON st.survey_teacher_id = stq.survey_teacher_id
        inner join survey_teacher_question_answer stqa on stqa.survey_teacher_question_id = stq.survey_teacher_question_id
        inner join "set" s on s.set_id = st.set_id
        inner join year_group yg on yg.year_id = s.year_id
        inner join subject sub on sub.subject_id = s.subject_id
        where st.created_at > '2024-03-17' and sub.subject_id = ${id}
        group by yg."name", stq.question_id, yg.year_id, sub.subject_name
        order by yg.year_id;
    `;

    // Procesar resultados para convertir BigInt a Number y estructurar los datos
    const processedResults = rawResults.map(entry => ({
        ...entry,
        cantidad_de_alumnos: Number(entry.cantidad_de_alumnos),
        porcentaje_respuestas_agree: Number(entry.porcentaje_respuestas_agree),
        porcentaje_respuestas_agree_not_sure: Number(entry.porcentaje_respuestas_agree_not_sure),
    }));

    // Estructura de datos para los resultados finales
    const result: ProcessedResponse = {
        subject: processedResults[0]?.subject_name || "",  // Asume que todos los registros tienen el mismo subject_name
    };

    processedResults.forEach(entry => {
        const yearName = entry.name;
        const questionId = entry.question_id;

        if (!result[yearName]) {
            result[yearName] = {
                studentSurveyed: entry.cantidad_de_alumnos,
                questions: Array.from({ length: 5 }, (_, i) => ({
                    questionId: i + 1,
                    agreePercentage: 0,
                    agreeAndNotSurePercentage: 0,
                }))
            };
        }

        // Ajustar la cantidad de encuestados si es necesario
        if (result[yearName].studentSurveyed < entry.cantidad_de_alumnos) {
            result[yearName].studentSurveyed = entry.cantidad_de_alumnos;
        }

        result[yearName].questions[questionId - 1].agreePercentage = entry.porcentaje_respuestas_agree;
        result[yearName].questions[questionId - 1].agreeAndNotSurePercentage = entry.porcentaje_respuestas_agree_not_sure;
    });



    return result;
}



  async getTeacherReport(id: number) {
    const subjectsTeacher = await this.prisma.subject.findMany({
      select: {
        subject_name: true,
      },
      where: {
        OR: [
          {
            set: {
              some: {
                year_id: {
                  in: [7, 8, 9, 10, 11]
                },
                teacher_by_set: {
                  some: {
                    teacher_id: id,
                    is_primary_teacher: true,
                  },
                },
                survey_teacher: {
                  some: {
                    created_at: {
                      gte: new Date('2024-03-05'),
                    },
                    student_has_survey_teacher: {
                      some: {
                        is_answered: true
                      }
                    },
                  },
                }
              },
            },
          },
          {
            set: {
              some: {
                year_id: {
                  in: [12, 13],
                },
                teacher_by_set: {
                  some: {
                    teacher_id: id,
                  },
                },
                survey_teacher: {
                  some: {
                    created_at: {
                      gte: new Date('2024-03-05'),
                    },
                    student_has_survey_teacher: {
                      some: {
                        is_answered: true
                      }
                    },
                  },
                }
              },
            },
          }
        ]
      }
    })

    const totalResults = {};
    for (const subject of subjectsTeacher) {

      const yearGroups = await this.prisma.year_group.findMany({
        select: {
          name: true,
          set: {
            select: {
              set_code: true
            },
            where: {
              subject: {
                subject_name: subject.subject_name,

              },
              survey_teacher: {
                some: {
                  created_at: {
                    gte: new Date('2024-03-05'),
                  },
                  student_has_survey_teacher: {
                    some: {
                      is_answered: true,
                    }
                  }
                }
              },
            }
          }
        },
        where: {
          OR: [
            {
              set: {
                some: {
                  year_id: {
                    in: [7, 8, 9, 10, 11]
                  },
                  subject: {
                    subject_name: subject.subject_name,
                  },
                  survey_teacher: {
                    some: {
                      created_at: {
                        gte: new Date('2024-03-05'),
                      },
                      student_has_survey_teacher: {
                        some: {
                          is_answered: true,
                        }
                      }
                    }
                  },
                  teacher_by_set: {
                    some: {
                      teacher_id: id,
                      is_primary_teacher: true,
                    }
                  },
                },
              },
            },
            {
              set: {
                some: {
                  year_id: {
                    in: [12, 13],
                  },
                  subject: {
                    subject_name: subject.subject_name,
                  },
                  survey_teacher: {
                    some: {
                      created_at: {
                        gte: new Date('2024-03-05'),
                      },
                      student_has_survey_teacher: {
                        some: {
                          is_answered: true,
                        }
                      }
                    }
                  },
                  teacher_by_set: {
                    some: {
                      teacher_id: id,
                    }
                  }
                },
              }
            }
          ]
        },
        orderBy: {
          year_id: "asc"
        }

      });

      const result = {};

      for (const year of yearGroups) {
        let studentSurveyCount = 0
        result[year.name] = {
          studentSurveyed: 0,
          questions: Array.from({ length: 5 }, (_, i) => {
            return {
              questionId: i + 1,
              agreePercentage: 0,
              agreeAndNotSurePercentage: 0
            };
          })
        };
        let studentSurveyedArray = []
        for (const set of year.set) {
          const totalStudentSurveyed = await this.prisma.student_has_survey_teacher.aggregate({
            where: {
              survey_teacher: {
                created_at: {
                  gte: new Date('2024-03-05'),
                },
                set: {
                  set_code: set.set_code,
                },
              },
              is_answered: true,
            },
            _count: true,
          });

          const studentCount = totalStudentSurveyed._count;
          studentSurveyCount += studentCount;

          const studentId = await this.prisma.student_has_survey_teacher.findMany({
            where: {
              survey_teacher: {
                created_at: {
                  gte: new Date('2024-03-05'),
                },
                set: {
                  set_code: set.set_code,
                },
              },
              is_answered: true,
            },
            select: {
              student_id: true
            },
            distinct: ['student_id']
          });

          studentSurveyedArray.push(studentId)


          for (let questionId = 1; questionId <= 5; questionId++) {
            const totalAgree = await this.prisma.survey_teacher_question_answer.aggregate({
              where: {
                survey_teacher_question: {
                  survey_teacher: {
                    created_at: {
                      gte: new Date('2024-03-05'),
                    },
                    set: {
                      set_code: set.set_code,
                    },
                  },
                  question_id: questionId,
                },
                answer: {
                  equals: "Agree",
                },
              },
              _count: true,
            });

            const totalAgreeAndNotSure = await this.prisma.survey_teacher_question_answer.aggregate({
              where: {
                survey_teacher_question: {
                  survey_teacher: {
                    created_at: {
                      gte: new Date('2024-03-05'),
                    },
                    set: {
                      set_code: set.set_code,
                    },
                  },
                  question_id: questionId,
                },
                answer: {
                  in: ["Agree", "Not sure"],
                },
              },
              _count: true,
            });
            const agreePercentage = totalAgree._count
            const agreeAndNotSurePercentage = totalAgreeAndNotSure._count

            result[year.name].questions[questionId - 1].agreePercentage += agreePercentage;
            result[year.name].questions[questionId - 1].agreeAndNotSurePercentage += agreeAndNotSurePercentage;
          }
        }
        studentSurveyedArray = studentSurveyedArray.flat()

        const uniqueStudentSurveyedArray = studentSurveyedArray.filter((item, index, array) => {
          // Verificar si el índice actual es igual al índice de la primera ocurrencia del objeto en el array
          return array.findIndex(obj => obj.student_id === item.student_id) === index;
        });

        result[year.name].studentSurveyed = uniqueStudentSurveyedArray.length;

        // Calcular los porcentajes promedio por pregunta
        result[year.name].questions.forEach(question => {
          question.agreePercentage = Math.round((question.agreePercentage / studentSurveyCount) * 100);
          question.agreeAndNotSurePercentage = Math.round((question.agreeAndNotSurePercentage / studentSurveyCount) * 100);
        });
      }

      totalResults[subject.subject_name] = result;
    }
    return totalResults;
  }

  async getTeacherReportWithSubject(id: number) {
    const sets = await this.prisma.set.findMany({
      where: {
        OR: [{
          teacher_by_set: {
            some: {
              teacher_id: id,
              is_primary_teacher: true,
            },
          },
          survey_teacher: {
            some: {
              created_at: {
                gte: new Date('2024-03-05'),
              },
              teacher_id: id,
              student_has_survey_teacher: {
                some: {
                  is_answered: true
                }
              }
            }
          },
          year_id: {
            in: [7, 8, 9, 10, 11],
          },
        },
        {
          teacher_by_set: {
            some: {
              teacher_id: id,
            },
          },
          survey_teacher: {
            some: {
              created_at: {
                gte: new Date('2024-03-05'),
              },
              teacher_id: id,
              student_has_survey_teacher: {
                some: {
                  is_answered: true
                }
              }
            }
          },
          year_id: {
            in: [12, 13],
          },
        },
        ]
      },
      select: {
        set_code: true,
        year_group: {
          select: {
            name: true
          },
        },
        subject: {
          select: {
            subject_name: true,
          },
        },
      },
      // distinct: ['set_code'],
      orderBy: { subject_id: 'desc' }
    });

    const result = {};

    const teacherName = await this.prisma.teacher.findFirst({
      select: {
        title: true,
        surname: true,
      },
      where: {
        staff_id: id
      }
    })
    // Crear un objeto para almacenar el resultado final, donde cada clave es el nombre de la materia
    for (const set of sets) {
      const totalStudentSurveyed = await this.prisma.student_has_survey_teacher.aggregate({
        where: {
          survey_teacher: {
            created_at: {
              gte: new Date('2024-03-05'),
            },
            set: {
              set_code: set.set_code,
            },
          },
          is_answered: true,
        },
        _count: true,
      });

      const studentIds = await this.prisma.student_has_survey_teacher.findMany({
        where: {
          survey_teacher: {
            created_at: {
              gte: new Date('2024-03-05'),
            },
            set: {
              set_code: set.set_code,
            },
          },
          is_answered: true,
        },
        select: {
          student_id: true
        },
        distinct: ['student_id']
      });

      const totalStudentSurveyedd = studentIds.length;

      const questionResults = [];

      for (let i = 1; i <= 5; i++) {
        const totalAgree = await this.prisma.survey_teacher_question_answer.aggregate({
          where: {
            survey_teacher_question: {
              survey_teacher: {
                created_at: {
                  gte: new Date('2024-03-05'),
                },
                set: {
                  set_code: set.set_code,
                },
              },
              question_id: i,
            },
            answer: {
              equals: "Agree",
            },
          },
          _count: true,
        });

        const totalAgreeAndNotSure = await this.prisma.survey_teacher_question_answer.aggregate({
          where: {
            survey_teacher_question: {
              survey_teacher: {
                created_at: {
                  gte: new Date('2024-03-05'),
                },
                set: {
                  set_code: set.set_code,
                },
              },
              question_id: i,
            },
            answer: {
              in: ["Agree", "Not sure"],
            },
          },
          _count: true,
        });

        questionResults.push({
          questionId: i,
          totalAgree: Math.round((totalAgree._count / totalStudentSurveyed._count) * 100),
          totalAgreeAndNotSure: Math.round((totalAgreeAndNotSure._count / totalStudentSurveyed._count) * 100)
        });
      }

      const teacherKey = teacherName.title + "." + ' ' + teacherName.surname;

      if (!result[teacherKey]) {
        result[teacherKey] = [];
      }

      result[teacherKey].push({
        setCode: set.set_code,
        yearName: set.year_group.name,
        subject: set.subject.subject_name,
        totalStudentSurveyed: totalStudentSurveyedd,
        questionResults,
      });
    }

    return result;
  }

}
