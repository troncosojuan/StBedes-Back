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
    const subject= await this.prisma.subject.findFirst({
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
        question.agreePercentage = Math.round((question.agreePercentage / result[year.name].studentSurveyed)*100);
        question.agreeAndNotSurePercentage = Math.round((question.agreeAndNotSurePercentage / result[year.name].studentSurveyed)*100);
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
        question.agreePercentage = Math.round((question.agreePercentage / result[year.name].studentSurveyed)*100);
        question.agreeAndNotSurePercentage = Math.round((question.agreeAndNotSurePercentage / result[year.name].studentSurveyed)*100);
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
