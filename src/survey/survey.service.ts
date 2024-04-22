import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyAnswerAndRelationDto, CreateSurveyAnswerDto, CreateSurveyDto, CreateSurveyTriggerDto } from './dto/createSurvey.dto';

@Injectable()
export class SurveyService {
   


    constructor(private readonly prisma: PrismaService) { }

    async getSurveyByStudent() {
        const surveys = await this.prisma.survey_question.findMany({
            select: {
                id: true,
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
            },
            where: {
                survey:{
                    created_at: {
                        gte: new Date('2024-04-05')
                    }
                }
            }
        });
        return surveys;
    }


    async createAnswer(data: CreateSurveyAnswerAndRelationDto) {
        const answer = await this.prisma.survey_question_answer.createMany({
            data: data.createSurveyAnswerDto
        });

        await this.prisma.student_has_survey.update({
            where: {
                id: data.student_has_survey_id
            },
            data: {
                is_answered: true
            }
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

    async createSurvey(data: CreateSurveyDto[]) {
        const createdSurveyIds: number[] = []; // Array para almacenar los IDs creados

        for (const surveyData of data) {
            const createdSurvey = await this.prisma.survey.create({
                data: {
                    survey_question: {
                        createMany: {
                            data: surveyData.survey_question.map(questionId => ({
                                question_id: questionId
                            }))
                        }
                    },
                    student_has_survey: {
                        createMany: {
                            data: surveyData.student_has_survey.map(studentId => ({
                                student_id: studentId
                            }))
                        }
                    }
                }
            });

            // Almacenar el ID del survey creado en el array
            createdSurveyIds.push(createdSurvey.survey_id);
        }

        return {surveyId: createdSurveyIds} // Devolver el array de IDs
    }

    async getSurveyByStudentId(id: number) {
        const survey = await this.prisma.student.findFirst({
            where: {
                student_id: id
            },
            select: {
                student_has_survey: {
                    select: {
                        id: true,
                        is_answered: true,
                    }
                }
            }
        }
        );
        return survey;
    }


    async createSurveyTrigger(data: CreateSurveyTriggerDto[]) {
        for (const surveyData of data) {
            await this.prisma.student_has_survey.createMany({
                data: surveyData.student_has_survey.map(studentId => ({
                    student_id: studentId,
                    survey_id: surveyData.survey_id
                }
                ))
            })
        }
    }


}
