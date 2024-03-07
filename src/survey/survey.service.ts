import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyAnswerDto, CreateSurveyDto, CreateSurveyParentAnswerDto, CreateSurveyParentDto, CreateSurveyTeacherAnswerDto, CreateSurveyTeacherDto } from './dto/createSurvey.dto';
import { SurveyByStudentTeacherSubjectDto } from './dto/getSurvey.dto';

@Injectable()
export class SurveyService {


    constructor(private readonly prisma: PrismaService) { }

    async getSurveysTeacherByStudent(id: number) {
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
                                survey_teacher_id: true,
                                teacher: {
                                    select: {
                                        full_name: true
                                    }
                                },
                                set: {
                                    select: {
                                        subject: {
                                            select: {
                                                subject_name: true
                                            }
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            }
        });
        return surveys;
    }

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
            }
        });
        return surveys;
    }


    async getSurveyQuestionBySurveyId(id: number) {
        const surveyQuestions = await this.prisma.survey_teacher_question.findMany({
            where: {
                survey_teacher_id: id
            },
            select: {
                survey_teacher_question_id: true,
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
        // Retornar las preguntas asociadas a la encuesta
        return surveyQuestions;
    }

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
    // hacer que sean solo los profesores
    async getTeacherListByStudent(id: number) {
        const student = await this.prisma.student.findFirst({
            where: {
                student_id: id
            },
            include: {
                set_list: {
                    include: {
                        set: {
                            include: {
                                teacher_by_set: {
                                    select: {
                                        teacher: {
                                            select: {
                                                full_name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!student) {
            throw new Error(`Student with id ${id} not found`);
        }

        const teachers: string[] = [];
        student.set_list.forEach(setItem => {
            setItem.set.teacher_by_set.forEach(teacherBySet => {
                const teacherName = teacherBySet.teacher.full_name;
                if (!teachers.includes(teacherName)) {
                    teachers.push(teacherName);
                }
            });
        });

        return teachers;
    }


    async getSurveyTeacherByStudent(data: SurveyByStudentTeacherSubjectDto) {

    }

}
