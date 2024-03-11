/*
  Warnings:

  - You are about to drop the `parent_has_survey_parent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "parent_has_survey_parent" DROP CONSTRAINT "survey_by_parent_parent_fk";

-- DropForeignKey
ALTER TABLE "parent_has_survey_parent" DROP CONSTRAINT "survey_by_parent_survey_parent_fk";

-- DropTable
DROP TABLE "parent_has_survey_parent";

-- CreateTable
CREATE TABLE "student_has_survey_parent" (
    "id" SERIAL NOT NULL,
    "survey_parent_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "is_answered" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_has_survey_parent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_has_survey_parent" ADD CONSTRAINT "survey_by_parent_parent_fk" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_has_survey_parent" ADD CONSTRAINT "survey_by_parent_survey_parent_fk" FOREIGN KEY ("survey_parent_id") REFERENCES "survey_parent"("survey_parent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
