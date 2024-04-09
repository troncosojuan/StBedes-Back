import { Injectable } from '@nestjs/common';
import { Response } from 'express';
const PDFDocument = require('pdfkit-table');
import { PrismaService } from 'src/prisma/prisma.service';

import { join, resolve } from 'path';


@Injectable()
export class ReportService {


  constructor(private readonly prisma: PrismaService) { }


  async getTeacherReportPDF(): Promise<Buffer> {
    const wholeCollegeResponses = await this.getWholeCollegeResponses();
    console.dir(wholeCollegeResponses, { depth: null });
    const pdfBuffer: Buffer = await new Promise(async resolve => {
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
          'Pág. ' + pageNumber,
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
      doc.moveDown();
      doc.font("Helvetica").fontSize(16);

      doc.text("Pupils were asked five questions about each of their subjects:", {
        width: doc.page.width - 100,
        align: 'left',
        // margen izquierdo
        indent: 30,
      });

      doc.moveDown();
      const indentSize = 50; // Tamaño de la identación
      doc.fontSize(12);


      doc.font("Helvetica-Bold").text("Homework ", { continued: true, indent: indentSize }).font("Helvetica").text("- I find homework is worthwhile and helps me become more confident in the subject", { indent: indentSize, width: doc.page.width - 100 });
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Feedback ", { continued: true, indent: indentSize }).font("Helvetica").text("- My teacher gives me regular feedback (either verbal or written) and I know what I need to do to improve", { indent: indentSize });
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Support ", { continued: true, indent: indentSize }).font("Helvetica").text("- I feel I get enough support and I know where to go to get extra help", { indent: indentSize });
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Progress ", { continued: true, indent: indentSize }).font("Helvetica").text("- I feel I understand the subject and learn something in each lesson", { indent: indentSize });
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Love of Learning ", { continued: true, indent: indentSize }).font("Helvetica").text("- Even if lessons are difficult or I don't like what we are learning about, the teacher inspires me and I grow in confidence", { indent: indentSize });


      doc.addPage();
      doc.text('', 50, 70);
      doc.moveDown();
      doc.font("Helvetica-Bold").fontSize(32);
      doc.text("Whole College Responses",{underline:true});
      doc.moveDown();
      //TODO: Tabla de whole college responses


      let rows = [];
      Object.entries(wholeCollegeResponses).forEach(([yearGroup, data]) => {
        const responseData = data as { questions: any[], studentSurveyed: number }; // Update type assertion to include 'studentSurveyed' property
        responseData.questions.forEach((question, index) => {
          // Cada pregunta se convierte en dos filas: una para TotalAgree y otra para TotalAgreeAndNotSure
          if(index === 0) {
            // Agrega la primera fila con el nombre del grupo de años y TotalAgree
            rows.push([yearGroup, responseData.studentSurveyed.toString(), 'TotalAgree', question.totalAgree]);
            // Agrega la segunda fila con TotalAgreeAndNotSure
            rows.push(['', '', 'TotalAgreeAndNotSure', question.totalAgreeAndNotSure]);
          } else {
            // Solo agrega las respuestas para las filas subsecuentes sin repetir el grupo de años y studentSurveyed
            rows.push(['', '', 'TotalAgree', question.totalAgree]);
            rows.push(['', '', 'TotalAgreeAndNotSure', question.totalAgreeAndNotSure]);
          }
        });
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


      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
      doc.end()


    })

    return pdfBuffer;
  }


  async getSubjectReportPDF(id: number) {
    throw new Error('Method not implemented.');
  }



  async getWholeCollegeResponses() {
    const yearGroups = await this.prisma.year_group.findMany({
      select: {
        name: true,
        set: {
          select: {
            set_code: true
          },
          where: {
            survey_teacher: {
              some: {
                student_has_survey_teacher: {
                  some: {
                    is_answered: true,
                  }
                }
              }
            }
          }
        }
      },
      where: {
        set: {
          some: {
            year_id: {
              in: [7, 8, 9, 10, 11, 12, 13]
            },
            survey_teacher: {
              some: {
                student_has_survey_teacher: {
                  some: {
                    is_answered: true,
                  }
                }
              }
            }
          }
        },
      },
    });

    const result = {};

    for (const year of yearGroups) {
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

      for (const set of year.set) {
        const totalStudentSurveyed = await this.prisma.student_has_survey_teacher.aggregate({
          where: {
            survey_teacher: {
              set: {
                set_code: set.set_code,
              },
            },
            is_answered: true,
          },
          _count: true,
        });

        const studentCount = totalStudentSurveyed._count;
        result[year.name].studentSurveyed += studentCount;

        for (let questionId = 1; questionId <= 5; questionId++) {
          const totalAgree = await this.prisma.survey_teacher_question_answer.aggregate({
            where: {
              survey_teacher_question: {
                survey_teacher: {
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

      // Calcular los porcentajes promedio por pregunta
      result[year.name].questions.forEach(question => {
        question.agreePercentage = Math.round((question.agreePercentage / result[year.name].studentSurveyed) * 100);
        question.agreeAndNotSurePercentage = Math.round((question.agreeAndNotSurePercentage / result[year.name].studentSurveyed) * 100);
      });
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
        subject: {
          subject_id: id,
        },
        survey_teacher: {
          some: {
            student_has_survey_teacher: {
              some: {
                is_answered: true,
              }
            }
          }
        }
      },
      select: {
        set_code: true,
        year_group: {
          select: {
            name: true,
          },
        },
        teacher_by_set: {
          select: {
            teacher: {
              select: {
                full_name: true,
              }
            }
          },
          where: {
            is_primary_teacher: true,
          }
        }
      },
    });
    const result = {};

    for (const set of sets) {
      const totalStudentSurveyed = await this.prisma.student_has_survey_teacher.aggregate({
        where: {
          survey_teacher: {
            set: {
              set_code: set.set_code,
            },
          },
          is_answered: true,
        },
        _count: true,
      });

      const questionResults = [];

      for (let i = 1; i <= 5; i++) {
        const totalAgree = await this.prisma.survey_teacher_question_answer.aggregate({
          where: {
            survey_teacher_question: {
              survey_teacher: {
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

      const teacherName = set.teacher_by_set[0].teacher.full_name;

      if (!result[teacherName]) {
        result[teacherName] = [];
      }

      result[teacherName].push({
        setCode: set.set_code,
        yearName: set.year_group.name,
        totalStudentSurveyed: totalStudentSurveyed._count,
        questionResults,
      });
    }


    return result;
  }

  async getSubjectReport(id: number) {
    const subject = await this.prisma.subject.findFirst({
      where: {
        subject_id: id,
      },
      select: {
        subject_name: true,
      },
    });

    const yearGroups = await this.prisma.year_group.findMany({
      select: {
        name: true,
        set: {
          select: {
            set_code: true
          },
          where: {
            subject: {
              subject_id: id,
            },
            survey_teacher: {
              some: {
                student_has_survey_teacher: {
                  some: {
                    is_answered: true,
                  }
                }
              }
            }
          }
        }
      },
      where: {
        set: {
          some: {
            year_id: {
              in: [7, 8, 9, 10, 11, 12, 13]
            },
            subject: {
              subject_id: id,
            },
            survey_teacher: {
              some: {
                student_has_survey_teacher: {
                  some: {
                    is_answered: true,
                  }
                }
              }
            }
          }
        },
      },
    });



    const result = {
      subject: subject.subject_name,

    };

    for (const year of yearGroups) {
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

      for (const set of year.set) {

        const totalStudentSurveyed = await this.prisma.student_has_survey_teacher.aggregate({
          where: {
            survey_teacher: {
              set: {
                set_code: set.set_code,
              },
            },
            is_answered: true,
          },
          _count: true,
        });

        const studentCount = totalStudentSurveyed._count;
        result[year.name].studentSurveyed += studentCount;

        for (let questionId = 1; questionId <= 5; questionId++) {
          const totalAgree = await this.prisma.survey_teacher_question_answer.aggregate({
            where: {
              survey_teacher_question: {
                survey_teacher: {
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


      // Calcular los porcentajes promedio por pregunta
      result[year.name].questions.forEach(question => {
        question.agreePercentage = Math.round((question.agreePercentage / result[year.name].studentSurveyed) * 100);
        question.agreeAndNotSurePercentage = Math.round((question.agreeAndNotSurePercentage / result[year.name].studentSurveyed) * 100);
      });
    }

    return result;
  }



  async getTeacherReport(id: number) {

    const subjectsTeacher = await this.prisma.subject.findMany({
      select: {
        subject_name: true,
      },
      where: {
        set: {
          some: {
            teacher_by_set: {
              some: {
                teacher_id: id,
                is_primary_teacher: true,
              },
            },
            survey_teacher: {
              some: {
                student_has_survey_teacher: {
                  some: {
                    is_answered: true
                  }
                }
              }
            }
          },
        },
      },
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
                  student_has_survey_teacher: {
                    some: {
                      is_answered: true,
                    }
                  }
                }
              }
            }
          }
        },
        where: {
          set: {
            some: {
              year_id: {
                in: [7, 8, 9, 10, 11, 12, 13]
              },
              subject: {
                subject_name: subject.subject_name,
              },
              survey_teacher: {
                some: {
                  student_has_survey_teacher: {
                    some: {
                      is_answered: true,
                    }
                  }
                }
              }
            }
          },
        },
      });

      const result = {};

      for (const year of yearGroups) {
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

        for (const set of year.set) {
          const totalStudentSurveyed = await this.prisma.student_has_survey_teacher.aggregate({
            where: {
              survey_teacher: {
                set: {
                  set_code: set.set_code,
                },
              },
              is_answered: true,
            },
            _count: true,
          });

          const studentCount = totalStudentSurveyed._count;
          result[year.name].studentSurveyed += studentCount;

          for (let questionId = 1; questionId <= 5; questionId++) {
            const totalAgree = await this.prisma.survey_teacher_question_answer.aggregate({
              where: {
                survey_teacher_question: {
                  survey_teacher: {
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

        // Calcular los porcentajes promedio por pregunta
        result[year.name].questions.forEach(question => {
          question.agreePercentage = Math.round((question.agreePercentage / result[year.name].studentSurveyed) * 100);
          question.agreeAndNotSurePercentage = Math.round((question.agreeAndNotSurePercentage / result[year.name].studentSurveyed) * 100);
        });
      }

      totalResults[subject.subject_name] = result;
    }
    return totalResults;
  }

  async getTeacherReportWithSubject(id: number) {
    const sets = await this.prisma.set.findMany({
      where: {
        subject: {
          set: {
            some: {
              teacher_by_set: {
                some: {
                  teacher_id: id,
                  is_primary_teacher: true,
                },
              },
              survey_teacher: {
                some: {
                  teacher_id: id,
                  student_has_survey_teacher: {
                    some: {
                      is_answered: true
                    }
                  }
                }
              }
            },
          },
        },
        year_id: {
          in: [7, 8, 9, 10, 11, 12],
        },
        survey_teacher: {
          some: {
            student_has_survey_teacher: {
              some: {
                is_answered: true
              }
            }
          }
        }
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
      distinct: ['set_code'],
      orderBy: { subject_id: 'desc' }
    });

    const result = {};

    const teacherName = await this.prisma.teacher.findFirst({
      select: {
        full_name: true,
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
            set: {
              set_code: set.set_code,
            },
          },
          is_answered: true,
        },
        _count: true,
      });

      const questionResults = [];

      for (let i = 1; i <= 5; i++) {
        const totalAgree = await this.prisma.survey_teacher_question_answer.aggregate({
          where: {
            survey_teacher_question: {
              survey_teacher: {
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
          totalAgree: (totalAgree._count / totalStudentSurveyed._count) * 100,
          totalAgreeAndNotSure: (totalAgreeAndNotSure._count / totalStudentSurveyed._count) * 100
        });
      }

      if (!result[teacherName.full_name]) {
        result[teacherName.full_name] = [];
      }

      result[teacherName.full_name].push({
        setCode: set.set_code,
        yearName: set.year_group.name,
        totalStudentSurveyed: totalStudentSurveyed._count,
        questionResults,
      });
    }

    return result;
  }

}
