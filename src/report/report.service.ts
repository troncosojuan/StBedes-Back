import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { isNumber } from 'class-validator';

@Injectable()
export class ReportService {

  constructor(private readonly prisma: PrismaService) { }




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



    // Crear un objeto para almacenar el resultado final
    const result = {};
    for (const year of yearGroups) {
      for (const set of year.set) {
        const questionResults = {}

        for (let v = 1; v <= 5; v++) {
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
              totalAgree: totalAgree._count,
              totalAgreeAndNotSure: totalAgreeAndNotSure._count
            });
          }



        }
      }
    }

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
          }
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

      if (!result[set.subject.subject_name]) {
        result[set.subject.subject_name] = [];
      }

      result[set.subject.subject_name].push({
        yearName: set.year_group.name,
        totalStudentSurveyed: totalStudentSurveyed._count,
        questionResults,
      });
    }

    return result;
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
        yearName: set.subject.subject_name,
        totalStudentSurveyed: totalStudentSurveyed._count,
        questionResults,
      });
    }

    return result;
  }





}
