import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyAnswerDto, CreateSurveyDto, CreateSurveyParentAnswerDto, CreateSurveyParentDto, CreateSurveyTeacherAnswerDto, CreateSurveyTeacherDto } from './dto/createSurvey.dto';

@Injectable()
export class SurveyService {
 



    constructor(private readonly prisma: PrismaService) { }


    async getSurveysTeacherByStudent(id: number) {
        await this.studentExist(id);
        const surveys = await this.prisma.student.findFirst({
            where: {
                student_id: id
            },
            select: {
                student_has_survey_teacher: {
                    select: {
                        is_answered: true,
                        survey_teacher: {
                            select: {
                                teacher: {
                                    select: {
                                        full_name: true
                                    }
                                },
                                survey_teacher_question: {
                                    select: {
                                        question: {
                                            select: {
                                                section: true,
                                                title: true,
                                                content: true,
                                                question_type: {
                                                    select: {
                                                        options: true,
                                                        type: true
                                                    }
                                                },
                    
                                            }
                                        }
                                    }
                                }
                            }

                        },
                    }
                }
            }
        });

        const surveyQuestions = await this.prisma.survey_question.findMany({
            select: {
             question: {
                 select: {
                     section: true,
                     title: true,
                     content: true,
                     question_type: {
                         select: {
                             options: true,
                             type: true
                         }
                     }
                 }
             },
            }
         });
        return { surveys, surveyQuestions };
    }


    // async getSurveyByStudent() {
    //     const surveys = await this.prisma.survey_question.findMany({
    //        select: {
    //         question: {
    //             select: {
    //                 section: true,
    //                 title: true,
    //                 content: true,
    //                 question_type: {
    //                     select: {
    //                         options: true,
    //                         type: true
    //                     }
    //                 }
    //             }
    //         },
    //        }
    //     });
    //     return surveys;
    // }


    // async getSurveyQuestionBySurveyId(id: number) {
    //     await this.surveyExist(id);
    //     const surveyQuestions = await this.prisma.survey_question.findMany({
    //         where: {
    //             survey_id: id
    //         }
    //     });

    //     // Retornar las preguntas asociadas a la encuesta
    //     return surveyQuestions;
    // }
    
    async createAnswer(data: CreateSurveyAnswerDto[]) {
        const answer = await this.prisma.survey_question_answer.createMany({
            data: data
        });

    }
    async createTeacherAnswer(data: CreateSurveyTeacherAnswerDto[]) {
        const answer = await this.prisma.survey_teacher_question_answer.createMany({
            data: data
        });
    }

    async studentExist(id: number) {
        const student = await this.prisma.student.findUnique({
            where: {
                student_id: id
            }
        })
        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }
    }

    async surveyExist(id: number) {
        const survey = await this.prisma.survey.findUnique({
            where: {
                survey_id: id
            }
        })
        if (!survey) {
            throw new NotFoundException(`Survey with ID ${id} not found`);
        }
    }

    async createSurveyTeacher(data: CreateSurveyTeacherDto[]) {
        for (const surveyData of data) {
            await this.prisma.survey_teacher.create({
                data: {
                    set_id: surveyData.set_id,
                    teacher_id: surveyData.teacher_id,
                    student_has_survey_teacher: {
                        createMany: {
                            data: surveyData.student_has_survey_teacher.map(studentId => ({
                                student_id: studentId
                            }))
                        },
                    },
                    survey_teacher_question: {
                        createMany: {
                            data: surveyData.survey_teacher_question.map(questionId => ({
                                question_id: questionId
                            }))
                        }
                    }
                }
            });
        }
    }

    async createSurveyParent(data: CreateSurveyParentDto[]) {
        for (const surveyData of data) {
            await this.prisma.survey_parent.create({
                data: {
                    survey_parent_question: {
                        createMany: {
                            data: surveyData.survey_parent_question.map(questionId => ({
                                question_id: questionId
                            }))
                        }
                    },
                }
            });
        }
    }
    async createParentAnswer(data: CreateSurveyParentAnswerDto[]) {
        await this.prisma.survey_parent_question_answer.createMany({
            data: data
        });
    }
    async createSurvey(data: CreateSurveyDto[]) {
        for (const surveyData of data) {
            await this.prisma.survey.create({
                data: {
                    survey_question: {
                        createMany: {
                            data: surveyData.survey_question.map(questionId => ({
                                question_id: questionId
                            }))
                        }
                    },
                }
            });
        }
    }
}
