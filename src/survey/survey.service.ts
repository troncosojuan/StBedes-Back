import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyAnswerAndRelationDto, CreateSurveyAnswerDto, CreateSurveyDto } from './dto/createSurvey.dto';

@Injectable()
export class SurveyService {


    constructor(private readonly prisma: PrismaService) { }



    async getSurveyByStudent() {
        const surveys = await this.prisma.survey_question.findMany({
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
                survey: {
                    select: {
                        student_has_survey: {
                            select: {
                                is_answered: true
                            }
                        }
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
                    student_has_survey: {
                        createMany: {
                            data: surveyData.student_has_survey.map(studentId => ({
                                student_id: studentId
                            }))
                        }
                    }
                }
            });
        }
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
                        survey: {
                            select: {
                                survey_id: true,
                            }
                        }
                    }
                }
            }
        }
        );
        return survey;
    }







}
