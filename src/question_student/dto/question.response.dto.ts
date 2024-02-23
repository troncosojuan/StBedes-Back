export class QuestionStudentResponseDto {
    question_content: string;

    question_options?: string;

    teacher_name?: string;

    student_id: number;

    subject_name?: string;

    section: string;

    is_answered: boolean;

    is_active: boolean;
}

/* 
falta:

question_id: number;
type: string;

*/