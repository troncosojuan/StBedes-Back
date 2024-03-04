/*
  Warnings:

  - You are about to drop the column `date` on the `survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "survey" DROP COLUMN "date";

-- CreateTable
CREATE TABLE "survey_parent" (
    "survey_parent_id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_parent_pkey" PRIMARY KEY ("survey_parent_id")
);

-- CreateTable
CREATE TABLE "survey_parent_question" (
    "survey_parent_question_id" SERIAL NOT NULL,
    "survey_parent_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_parent_question_pkey" PRIMARY KEY ("survey_parent_question_id")
);

-- CreateTable
CREATE TABLE "survey_parent_question_answer" (
    "id" SERIAL NOT NULL,
    "survey_parent_question_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "answer" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_parent_question_answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "survey_parent_question" ADD CONSTRAINT "survey_parent_question_survey_parent_fk" FOREIGN KEY ("survey_parent_id") REFERENCES "survey_parent"("survey_parent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_parent_question" ADD CONSTRAINT "survey_parent_question_question_fk" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_parent_question_answer" ADD CONSTRAINT "survey_parent_question_answer_survey_parent_question_fk" FOREIGN KEY ("survey_parent_question_id") REFERENCES "survey_parent_question"("survey_parent_question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_parent_question_answer" ADD CONSTRAINT "survey_parent_question_answer_student_fk" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
