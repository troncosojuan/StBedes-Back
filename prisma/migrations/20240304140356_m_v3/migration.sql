-- AlterTable
CREATE SEQUENCE student_by_year_id_seq;
ALTER TABLE "student_by_year" ALTER COLUMN "id" SET DEFAULT nextval('student_by_year_id_seq');
ALTER SEQUENCE student_by_year_id_seq OWNED BY "student_by_year"."id";
