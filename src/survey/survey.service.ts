import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyAnswerDto, CreateSurveyTeacherAnswerDto, CreateSurveyTeacherDto } from './dto/createSurvey.dto';

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
                student_has_survey: {
                    select: {
                        survey: true,
                        is_answered: true
                    }
                },
                student_has_survey_teacher: {
                    select: {
                        survey_teacher: true,
                        is_answered: true
                    }
                }
            }
        })
    }

    async getSurveyTeacherQuestionsBySurveyTeacherId(id: number) {
        await this.surveyExist(id);
        const surveyTeacherQuestions = await this.prisma.survey_teacher_question.findMany({
            where: {
                survey_teacher_id: id
            }
        });

        // Retornar las preguntas del profesor asociadas a la encuesta
        return surveyTeacherQuestions;
    }

    async getSurveyQuestionBySurveyId(id: number) {
        await this.surveyExist(id);
        const surveyQuestions = await this.prisma.survey_question.findMany({
            where: {
                survey_id: id
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
        const survey = await this.prisma.survey_teacher.createMany({
            data: data
        });

    }
}
