/*
  Warnings:

  - You are about to drop the `student_has_survey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "student_has_survey" DROP CONSTRAINT "survey_by_teacher_student_fk";

-- DropForeignKey
ALTER TABLE "student_has_survey" DROP CONSTRAINT "survey_by_teacher_survey_teacher_fk";

-- DropTable
DROP TABLE "student_has_survey";
