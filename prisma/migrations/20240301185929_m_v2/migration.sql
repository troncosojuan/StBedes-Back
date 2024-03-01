-- AlterTable
ALTER TABLE "department" ALTER COLUMN "department_id" DROP DEFAULT,
ALTER COLUMN "last_update_api_date" SET DATA TYPE TEXT;
DROP SEQUENCE "department_department_id_seq";

-- AlterTable
ALTER TABLE "question" ALTER COLUMN "question_id" DROP DEFAULT;
DROP SEQUENCE "question_question_id_seq";

-- AlterTable
ALTER TABLE "question_type" ALTER COLUMN "question_type_id" DROP DEFAULT;
DROP SEQUENCE "question_type_question_type_id_seq";

-- AlterTable
ALTER TABLE "set" ALTER COLUMN "set_id" DROP DEFAULT,
ALTER COLUMN "last_update_api_date" SET DATA TYPE TEXT;
DROP SEQUENCE "set_set_id_seq";

-- AlterTable
ALTER TABLE "set_list" ALTER COLUMN "set_list_id" DROP DEFAULT,
ALTER COLUMN "last_update_api_date" SET DATA TYPE TEXT;
DROP SEQUENCE "set_list_set_list_id_seq";

-- AlterTable
ALTER TABLE "student" ALTER COLUMN "student_id" DROP DEFAULT;
DROP SEQUENCE "student_student_id_seq";

-- AlterTable
ALTER TABLE "student_by_year" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "student_by_year_id_seq";

-- AlterTable
ALTER TABLE "subject" ADD COLUMN     "last_update_api_date" TEXT,
ALTER COLUMN "subject_id" DROP DEFAULT;
DROP SEQUENCE "subject_subject_id_seq";

-- AlterTable
ALTER TABLE "teacher" ALTER COLUMN "staff_id" DROP DEFAULT;
DROP SEQUENCE "teacher_staff_id_seq";
