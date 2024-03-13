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

  async getWholeCollegeResponses() {
    // Obtener la lista de grados y la cantidad de estudiantes para cada grado
    const yearGroups = await this.prisma.year_group.findMany({
      where: {
        year_id: {
          in: [7, 8, 9, 10, 11, 12, 13],
        },
        set: {
          some: {
            set_list: {
              some: {
                student_id: {
                  not: null,
                },
              }
            }
          }
        },
      },
      include: {
        set: {
          include: {
            set_list: {
              select: {
                student_id: true,
              },
            },
          },
        },
      },
    });

    // Crear un objeto para almacenar el resultado final
    const result = {};

    // Recorrer cada grado y calcular la cantidad de estudiantes y los porcentajes de respuestas
    for (const yearGroup of yearGroups) {
      const yearId = yearGroup.year_id;
      let totalStudentCount = 0;
      let totalAgreeCounts = Array(5).fill(0);
      let totalAgreeAndNotSureCounts = Array(5).fill(0);

      // Calcular la cantidad total de estudiantes y los totales de respuestas "Agree" y "Agree and Not Sure" por pregunta
      for (const set of yearGroup.set) {
        const studentCount = set.set_list?.length || 0;
        totalStudentCount += studentCount;

        for (let i = 1; i <= 5; i++) {
          const agreeCounts = await this.prisma.survey_teacher_question_answer.aggregate({
            where: {
              survey_teacher_question: {
                question_id: {
                  in: [1, 2, 3, 4, 5],
                }
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
              survey_teacher_question_id: i,
              answer: {
                in: ["Agree", "Not sure"],
              },
            },
            _count: {
              answer: true,
            },
          });

          totalAgreeCounts[i - 1] += agreeCounts._count.answer;
          totalAgreeAndNotSureCounts[i - 1] += agreeAndNotSureCounts._count.answer;
        }
      }

      // Calcular los porcentajes de respuestas "Agree" y "Agree and Not Sure" por pregunta
      const totalAgreePercentages = totalAgreeCounts.map(count => (count / totalStudentCount) * 100);
      const totalAgreeAndNotSurePercentages = totalAgreeAndNotSureCounts.map(count => (count / totalStudentCount) * 100);

      // Agregar los datos del año al resultado final
      result[yearId] = {
        totalStudentCount,
        totalAgreePercentages,
        totalAgreeAndNotSurePercentages,
      };
    }

    return result;
  }


  async getSubjectReportWithTeacher(id: number) {
    // Obtener la lista de conjuntos y la cantidad de estudiantes para cada conjunto
    const sets = await this.prisma.set.findMany({
      where: {
        year_id: {
          in: [7, 8, 9, 10, 11, 12, 13],
        },
        set_list: {
          some: {
            student_id: {
              not: null,
            },
          }
        },
        subject_id: id,
        teacher_by_set: {
          some: {
            is_primary_teacher: true,
          },
        },
      },
      include: {
        set_list: {
          select: {
            student_id: true,
          },
        },
        teacher_by_set: {
          where: {
            is_primary_teacher: true,
          },
          select: {
            set_id: true,
            teacher: {
              select: {
                staff_id: true,
                full_name: true,
              },
            },
          },
        },
      },
    });

    // Crear un array para almacenar el resultado final
    const result = [];

    // Recorrer cada conjunto y calcular la cantidad de estudiantes y los porcentajes de encuestas
    for (const set of sets) {
      const setCode = set.set_code;
      const studentCount = set.set_list?.length || 0; // Verificar si set_list existe antes de acceder a su longitud

      // Obtener la lista de profesores para el conjunto actual
      const teachers = set.teacher_by_set.map((teacherBySet) => ({
        staff_id: teacherBySet.teacher.staff_id,
        full_name: teacherBySet.teacher.full_name,
      }));

      // Obtener los conteos de respuestas de cada pregunta por profesor
      for (const teacher of teachers) {
        const teacherSurveyReport = [];

        for (let i = 1; i <= 5; i++) {
          const agreeCounts = await this.prisma.survey_teacher_question_answer.aggregate({
            where: {
              survey_teacher_question: {
                survey_teacher: {
                  set_id: set.set_id, // Filtrar por el ID del conjunto actual
                  teacher_id: teacher.staff_id // Filtrar por el ID del profesor
                },
                question_id: i,
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
              survey_teacher_question: {
                survey_teacher: {
                  set_id: set.set_id,
                  teacher_id: teacher.staff_id // Filtrar por el ID del profesor
                },
                question_id: i,
              },
              answer: {
                in: ["Agree", "Not sure"],
              },
            },
            _count: {
              answer: true,
            },
          });

          const totalAgree = agreeCounts._count.answer;
          const totalAgreeAndNotSure = agreeAndNotSureCounts._count.answer;

          const totalAgreePercentage = (totalAgree / studentCount) * 100;
          const totalAgreeAndNotSurePercentage = (totalAgreeAndNotSure / studentCount) * 100;

          teacherSurveyReport.push({
            questionId: i,
            totalAgreePercentage,
            totalAgreeAndNotSurePercentage,
          });
        }

        // Agregar la información del profesor y sus respuestas al resultado final
        result.push({
          setCode,
          studentCount,
          teacher: {
            staff_id: teacher.staff_id,
            full_name: teacher.full_name,
          },
          surveyReport: teacherSurveyReport,
        });
      }
    }

    return result;
  }



  async getSubjectReport(id: number) {
    // Obtener la lista de sets y la cantidad de estudiantes
    const sets = await this.prisma.set.findMany({
      where: {
        year_id: {
          in: [7, 8, 9, 10, 11, 12, 13],
        },
        subject_id: id,
        set_list: {
          some: {
            student_id: {
              not: null,
            },
          }
        }
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
      const questionResults = [];

      // Calcular el promedio de Agree y Agree and Not Agree contestadas del total
      for (let i = 1; i <= 5; i++) {
        const agreeCounts = await this.prisma.survey_teacher_question_answer.aggregate({
          where: {
            survey_teacher_question: {
              survey_teacher: {
                set: {
                  set_code: setCode // Filtrar por el código del conjunto actual
                }
              },
              question_id: i,
              // Aquí puedes agregar más condiciones de filtrado si es necesario
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
            survey_teacher_question: {
              survey_teacher: {
                set: {
                  set_code: setCode // Filtrar por el código del conjunto actual
                }
              },
              question_id: i,
              // Aquí puedes agregar más condiciones de filtrado si es necesario
            },
            answer: {
              in: ["Agree", "Not sure"],
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

        // Agregar la información de la pregunta al array de resultados de preguntas
        questionResults.push({
          questionId: i,
          totalAgreePercentage,
          totalAgreeAndNotSurePercentage
        });
      }

      // Agregar la información del conjunto al resultado final
      result.push({
        setCode,
        studentCount,
        questions: questionResults
      });
    }
    return result;
  }

  async getTeacherReport(id: number) {
    //Obtener las materias que el maestro está enseñando
    const subjects = await this.prisma.set.findMany({
      where: {
        teacher_by_set: {
          some: {
            teacher_id: id,
          },
        },
      },
      include: {
        subject: true,
      },
    });
    // Obtener la lista de conjuntos (sets) en los que el maestro está enseñando la materia
    const sets = await this.prisma.set.findMany({
      where: {

        subject_id: {
          in: subjects.map((subject) => subject.subject_id),
        },
        set_list: {
          some: {
            student_id: {
              not: null,
            },
          }
        },
      },
        include: {
          subject: true, // Incluir la información de la materia
          year_group: true,
          set_list: true,
          // Incluir la información del grado
        },
      });

    // Crear un objeto para almacenar el resultado final, donde cada clave es el nombre de la materia
    const result = {};

    // Recorrer cada conjunto y obtener la cantidad total de estudiantes y el set_code
    for (const set of sets) {
      const setCode = set.set_code;
      const subjectName = set.subject.subject_name; // Nombre de la materia
      const yearGroupName = set.year_group.name; // Nombre del grado
      const yearGroupId = set.year_group.year_id; // ID del grado

      // Verificar si el año del grado está dentro del rango del 7 al 13
      if (yearGroupId >= 7 && yearGroupId <= 13) {
        const studentCount = set.set_list.length; // Cantidad total de estudiantes

        // Calcular los porcentajes de respuestas "Agree" y "Agree and Not Sure" por conjunto
        const totalAgreeCounts = Array(5).fill(0);
        const totalAgreeAndNotSureCounts = Array(5).fill(0);

        for (let i = 1; i <= 5; i++) {
          const agreeCounts = await this.prisma.survey_teacher_question_answer.aggregate({
            where: {
              survey_teacher_question: {
                question_id: i,
                survey_teacher: {
                  set: {
                    set_code: setCode,
                  },
                },
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
              survey_teacher_question: {
                question_id: i,
                survey_teacher: {
                  set: {
                    set_code: setCode,
                  },
                },
              },
              answer: {
                in: ["Agree", "Not sure"],
              },
            },
            _count: {
              answer: true,
            },
          });

          totalAgreeCounts[i - 1] += agreeCounts._count.answer;
          totalAgreeAndNotSureCounts[i - 1] += agreeAndNotSureCounts._count.answer;
        }

        const totalAgreePercentages = totalAgreeCounts.map((count) => (count / studentCount) * 100);
        const totalAgreeAndNotSurePercentages = totalAgreeAndNotSureCounts.map((count) => (count / studentCount) * 100);

        // Si aún no existe una entrada para esta materia en el resultado, crear una nueva entrada
        if (!result[subjectName]) {
          result[subjectName] = [];
        }

        // Agregar la información al array correspondiente a esta materia
        result[subjectName].push({
          yearGroupName,
          setCode,
          studentCount,
          totalAgreePercentages,
          totalAgreeAndNotSurePercentages,
        });
      }
    }

    return result;
  }

  async getTeacherReportWithSubject(id: number) {
    // Obtener información del profesor
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        staff_id: id,
      },
      select: {
        full_name: true,
      },
    });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    const teacherFullName = teacher.full_name;

    // Obtener la lista de conjuntos (sets) en los que el maestro está enseñando la materia
    const sets = await this.prisma.set.findMany({
      where: {
        teacher_by_set: {
          some: {
            teacher_id: id, // Filtrar por el ID del maestro
          },
        },
      },
      include: {
        subject: true, // Incluir la información de la materia
        year_group: true,
        set_list: true,
        // Incluir la información del grado
      },
    });

    // Crear un objeto para almacenar el resultado final, donde cada clave es el nombre de la materia
    const result = {};

    // Recorrer cada conjunto y obtener la cantidad total de estudiantes y el set_code
    for (const set of sets) {
      const setCode = set.set_code;
      const subjectName = set.subject.subject_name; // Nombre de la materia
      const yearGroupName = set.year_group.name; // Nombre del grado
      const yearGroupId = set.year_group.year_id; // ID del grado

      // Verificar si el año del grado está dentro del rango del 7 al 13
      if (yearGroupId >= 7 && yearGroupId <= 13) {
        const studentCount = set.set_list.length; // Cantidad total de estudiantes

        // Si aún no existe una entrada para esta materia en el resultado, crear una nueva entrada
        if (!result[subjectName]) {
          result[subjectName] = {
            teacher: teacherFullName, // Nombre completo del profesor
            totalStudentCount: 0, // Inicializar el contador de estudiantes
            sets: [], // Array para almacenar información de los conjuntos
          };
        }

        // Incrementar el contador de estudiantes total para esta materia
        result[subjectName].totalStudentCount += studentCount;

        // Calcular los porcentajes de las respuestas de las encuestas
        const surveyResults = await this.calculateSurveyResults(setCode, studentCount);

        // Agregar información del conjunto al array correspondiente a esta materia
        result[subjectName].sets.push({
          yearGroupName,
          setCode,
          studentCount,
          surveyResults,
        });
      }
    }

    return result;
  }

  async calculateSurveyResults(setCode: string, studentCount: number) {
    const result = [];

    for (let i = 1; i <= 5; i++) {
      const agreeCounts = await this.prisma.survey_teacher_question_answer.aggregate({
        where: {
          survey_teacher_question: {
            survey_teacher: {
              set: {
                set_code: setCode,
              },
            },
            question_id: i,
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
          survey_teacher_question: {
            survey_teacher: {
              set: {
                set_code: setCode,
              },
            },
            question_id: i,
          },
          answer: {
            in: ["Agree", "Not sure"],
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

      result.push({
        questionId: i,
        totalAgreePercentage,
        totalAgreeAndNotSurePercentage,
      });
    }

    return result;
  }



}
