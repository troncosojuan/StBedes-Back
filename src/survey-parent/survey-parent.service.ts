import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyParentAnswerAndRelationDto, CreateSurveyParentAnswerDto, CreateSurveyParentDto, CreateSurveyParentTriggerDto } from './dto/survey-parent.dto';

@Injectable()
export class SurveyParentService {
   

    constructor(private readonly prisma: PrismaService) { }

    async getSurveyParentByParentId(id: number) {
        const survey = await this.prisma.parent.findFirst({
            where: {
                parent_id: id
            },
            select: {
                family: {
                    select: {
                        student: {
                            select: {
                                student_id: true,
                                forename: true,
                                surname: true,
                                student_has_survey_parent: {
                                    select: {
                                        id: true,
                                        is_answered: true
                                    }
                                }
                            }
                        }
                    }
                },
            }
        }
        );
        return survey;
    }

    async getSurveyByParentId(id: number) {
        const surveyQuestions = await this.prisma.parent.findMany({
            where: {
                parent_id: id
            },
            select: {
                family: {
                    select: {
                        student: {
                            select: {
                                student_id: true,
                                forename: true,
                                surname: true
                            }
                        }
                    }
                },
            }
        });
        // Retornar las preguntas asociadas a la encuesta
        return surveyQuestions;
    }

    async getQuestionParentByStudent(id: number) {

        const yearId = await this.prisma.student_by_year.findFirst({
            where: {
                student_id: id
            },
            select: {
                year_id: true
            }
        });

        if (yearId.year_id < 7) {
            const question = await this.prisma.survey_parent_question.findMany({
                where: {
                    question_id: {
                        not: 49
                    },
                },
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
            return question;
        } else {
            const question = await this.prisma.survey_parent_question.findMany({
                where: {
                    question_id: {
                        not: 50
                    },
                },
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
            return question;
        }
    }

    async createSurveyParent(data: CreateSurveyParentDto[]) {
        const createdSurveyParentIds: number[] = []; // Array para almacenar los IDs creados
    
        for (const surveyData of data) {
            const createdSurveyParent = await this.prisma.survey_parent.create({
                data: {
                    survey_parent_question: {
                        createMany: {
                            data: surveyData.survey_parent_question.map(questionId => ({
                                question_id: questionId
                            }))
                        }
                    },
                    student_has_survey_parent: {
                        createMany: {
                            data: surveyData.student_has_survey_parent.map(studentId => ({
                                student_id: studentId
                            }))
                        }
                    }
                }
            });
    
            // Almacenar el ID del survey_parent creado en el array
            createdSurveyParentIds.push(createdSurveyParent.survey_parent_id);
        }
    
        return { surveyParentId: createdSurveyParentIds }; // Devolver el array de IDs
    }

    async createParentAnswer(data: CreateSurveyParentAnswerAndRelationDto) {
        await this.prisma.survey_parent_question_answer.createMany({
            data: data.createSurveyParentAnswerDto
        });

        await this.prisma.student_has_survey_parent.update({
            where: {
                id: data.student_has_survey_parent_id
            },
            data: {
                is_answered: true
            }
        });
    }

    async createSurveyParentTrigger(data: CreateSurveyParentTriggerDto[]) {
        for (const surveyData of data) {
            this.prisma.student_has_survey_parent.createMany({
                data: surveyData.student_has_survey_parent.map(studentId => ({
                    student_id: studentId,
                    survey_parent_id: surveyData.survey_parent_id
                }
                ))
            })
        }
    }

}
