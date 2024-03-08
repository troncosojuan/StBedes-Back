-- CreateTable
CREATE TABLE "parent_has_survey_parent" (
    "id" SERIAL NOT NULL,
    "survey_parent_id" INTEGER NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "is_answered" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_has_survey_parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_has_survey" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "is_answered" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_has_survey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parent_has_survey_parent" ADD CONSTRAINT "survey_by_parent_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "parent"("parent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_has_survey_parent" ADD CONSTRAINT "survey_by_parent_survey_parent_fk" FOREIGN KEY ("survey_parent_id") REFERENCES "survey_parent"("survey_parent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_has_survey" ADD CONSTRAINT "survey_by_student_student_fk" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_has_survey" ADD CONSTRAINT "survey_by_student_survey_fk" FOREIGN KEY ("survey_id") REFERENCES "survey"("survey_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
