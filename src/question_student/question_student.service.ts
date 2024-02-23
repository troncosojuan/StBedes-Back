import { Get, Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionStudentService {
    constructor(private readonly prisma: PrismaService) { }

    async getActiveQuestions(studentId: any): Promise<any> {
        const questions = await this.prisma.active_question_student.findMany({
            where: {
                student_id: studentId
            }
        })
        return questions;
    }
}


// {
//     "status": 200,
//     "response": {
//         "questions": [
//             {
//                 "row_number": 33407,
//                 "set_id": 4132,
//                 "student_id": 4424,
//                 "teacher_id": 699,
//                 "question_id": 1,
//                 "teacher_full_name": "Sam Griffin",
//                 "subject_name": "Games",
//                 "section": "Academic",
//                 "content": "I feel I understand the subject and learn something in each lesson",
//                 "type": "select",
//                 "options": "[\"Agree\", \"Not sure\", \"Disagree\"]",
//                 "answer": null,
//                 "is_answered": false
//             },
//             {
//                 "row_number": 11117,
//                 "set_id": 3664,
//                 "student_id": 4424,
//                 "teacher_id": 770,
//                 "question_id": 1,
//                 "teacher_full_name": "Simon Cooke",
//                 "subject_name": "PSMEE",
//                 "section": "Academic",
//                 "content": "I feel I understand the subject and learn something in each lesson",
//                 "type": "select",
//                 "options": "[\"Agree\", \"Not sure\", \"Disagree\"]",
//                 "answer": null,
//                 "is_answered": false
//             },
//             {
//                 "row_number": 126,
//                 "student_id": 4424,
//                 "question_id": 25,
//                 "section": "School",
//                 "content": "I engage with sports teams and clubs the College is offering.",
//                 "title": null,
//                 "type": "select",
//                 "options": "[\"Agree\", \"Not sure\", \"Disagree\"]",
//                 "answer": null,
//                 "is_answered": false
//             },
//             {
//                 "row_number": 127,
//                 "student_id": 4424,
//                 "question_id": 26,
//                 "section": "School",
//                 "content": "I am happy with the range of sports offered at College.",
//                 "title": null,
//                 "type": "select",
//                 "options": "[\"Agree\", \"Not sure\", \"Disagree\"]",
//                 "answer": null,
//                 "is_answered": false
//             }
//         ],
//         "is_school_open": true,
//         "is_academic_open": true
//     }
// }