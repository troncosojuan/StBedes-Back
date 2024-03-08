import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyTeacherAnswerAndRelationDto, CreateSurveyTeacherDto } from './dto/survey-teacher.dto';

@Injectable()
export class SurveyTeacherService {

    constructor(private readonly prisma: PrismaService) { }

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

    async getSurveysTeacherByStudent(id: number) {
        const surveys = await this.prisma.student.findFirst({
            where: {
                student_id: id
            },
            select: {
                student_has_survey_teacher: {
                    select: {
                        id: true,
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

    async createTeacherAnswer(data: CreateSurveyTeacherAnswerAndRelationDto) {
        const answer = await this.prisma.survey_teacher_question_answer.createMany({
            data: data.CreateSurveyTeacherAnswerDto
        });

        await this.prisma.student_has_survey_teacher.update({
            where: {
                id: data.student_has_survey_teacher
            },
            data: {
                is_answered: true
            }
        });
    }

}
