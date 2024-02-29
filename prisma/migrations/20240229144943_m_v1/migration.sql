-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "question_id" SERIAL NOT NULL,
    "section" TEXT,
    "title" TEXT,
    "content" TEXT,
    "type" INTEGER,
    "question_type_id" INTEGER,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "question_type" (
    "question_type_id" SERIAL NOT NULL,
    "options" JSONB,
    "type" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_type_pkey" PRIMARY KEY ("question_type_id")
);

-- CreateTable
CREATE TABLE "set" (
    "set_id" SERIAL NOT NULL,
    "subject_id" INTEGER,
    "year_id" INTEGER,
    "set_code" TEXT,
    "last_update_api_date" TIMESTAMPTZ,
    "is_included" BOOLEAN,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "set_pkey" PRIMARY KEY ("set_id")
);

-- CreateTable
CREATE TABLE "set_list" (
    "set_list_id" SERIAL NOT NULL,
    "set_id" INTEGER,
    "student_id" INTEGER,
    "last_update_api_date" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "set_list_pkey" PRIMARY KEY ("set_list_id")
);

-- CreateTable
CREATE TABLE "student" (
    "student_id" SERIAL NOT NULL,
    "person_id" INTEGER,
    "family_id" INTEGER,
    "title" TEXT,
    "forename" TEXT,
    "surname" TEXT,
    "middle_name" TEXT,
    "initials" TEXT,
    "preferred_name" TEXT,
    "fullname" TEXT,
    "gender" TEXT,
    "form" TEXT,
    "email_address" TEXT,
    "pupil_type" TEXT,
    "enrolment_date" TEXT,
    "enrolment_school_year" INTEGER,
    "password" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "student_by_year" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "year_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_by_year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "subject_id" SERIAL NOT NULL,
    "subject_name" TEXT,
    "is_included" BOOLEAN,
    "department_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "department" (
    "department_id" SERIAL NOT NULL,
    "department_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "last_update_api_date" TIMESTAMPTZ,

    CONSTRAINT "department_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "staff_id" SERIAL NOT NULL,
    "person_id" INTEGER,
    "title" TEXT,
    "forename" TEXT,
    "surname" TEXT,
    "middle_names" TEXT,
    "initials" TEXT,
    "preferred_name" TEXT,
    "full_name" TEXT,
    "gender" TEXT,
    "school_email_address" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "teacher_by_set" (
    "set_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "is_primary_teacher" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_by_set_pk" PRIMARY KEY ("set_id","teacher_id")
);

-- CreateTable
CREATE TABLE "year_group" (
    "year_id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "year_group_pkey" PRIMARY KEY ("year_id")
);

-- CreateTable
CREATE TABLE "survey" (
    "survey_id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_pkey" PRIMARY KEY ("survey_id")
);

-- CreateTable
CREATE TABLE "survey_status" (
    "id" SERIAL NOT NULL,
    "survey" TEXT,
    "section" TEXT,
    "is_open" BOOLEAN,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_question" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_question_answer" (
    "id" SERIAL NOT NULL,
    "survey_question_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "answer" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_question_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_teacher" (
    "survey_teacher_id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "set_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_teacher_pkey" PRIMARY KEY ("survey_teacher_id")
);

-- CreateTable
CREATE TABLE "survey_teacher_question" (
    "survey_teacher_question_id" SERIAL NOT NULL,
    "survey_teacher_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "is_included" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_teacher_question_pkey" PRIMARY KEY ("survey_teacher_question_id")
);

-- CreateTable
CREATE TABLE "survey_teacher_question_answer" (
    "id" SERIAL NOT NULL,
    "survey_teacher_question_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "answer" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_teacher_question_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_has_survey_teacher" (
    "id" SERIAL NOT NULL,
    "survey_teacher_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "is_answered" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_has_survey_teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_has_survey" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "is_answered" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_has_survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "fk_question_type" FOREIGN KEY ("question_type_id") REFERENCES "question_type"("question_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "set" ADD CONSTRAINT "fk_set_subject" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "set" ADD CONSTRAINT "fk_set_year_group" FOREIGN KEY ("year_id") REFERENCES "year_group"("year_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "set_list" ADD CONSTRAINT "fk_setlist_set" FOREIGN KEY ("set_id") REFERENCES "set"("set_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "set_list" ADD CONSTRAINT "fk_setlist_student" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_by_year" ADD CONSTRAINT "student_by_year_student_fk" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_by_year" ADD CONSTRAINT "student_by_year_year_group_fk" FOREIGN KEY ("year_id") REFERENCES "year_group"("year_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "fk_subject_department" FOREIGN KEY ("department_id") REFERENCES "department"("department_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher_by_set" ADD CONSTRAINT "teacher_by_set_set_fk" FOREIGN KEY ("set_id") REFERENCES "set"("set_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher_by_set" ADD CONSTRAINT "teacher_by_set_teacher_fk" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("staff_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_question" ADD CONSTRAINT "survey_question_survey_fk" FOREIGN KEY ("survey_id") REFERENCES "survey"("survey_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_question" ADD CONSTRAINT "survey_question_question_fk" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_question_answer" ADD CONSTRAINT "survey_question_answer_survey_question_fk" FOREIGN KEY ("survey_question_id") REFERENCES "survey_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_teacher" ADD CONSTRAINT "survey_teacher_set_fk" FOREIGN KEY ("set_id") REFERENCES "set"("set_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_teacher" ADD CONSTRAINT "survey_teacher_teacher_fk" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("staff_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_teacher_question" ADD CONSTRAINT "survey_teacher_question_survey_teacher_fk" FOREIGN KEY ("survey_teacher_id") REFERENCES "survey_teacher"("survey_teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_teacher_question" ADD CONSTRAINT "survey_teacher_question_question_fk" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_teacher_question_answer" ADD CONSTRAINT "survey_teacher_question_answer_survey_teacher_question_fk" FOREIGN KEY ("survey_teacher_question_id") REFERENCES "survey_teacher_question"("survey_teacher_question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey_teacher_question_answer" ADD CONSTRAINT "survey_teacher_question_answer_student_fk" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_has_survey_teacher" ADD CONSTRAINT "survey_by_teacher_survey_teacher_fk" FOREIGN KEY ("survey_teacher_id") REFERENCES "survey_teacher"("survey_teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_has_survey_teacher" ADD CONSTRAINT "survey_by_teacher_student_fk" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_has_survey" ADD CONSTRAINT "survey_by_teacher_survey_teacher_fk" FOREIGN KEY ("survey_id") REFERENCES "survey"("survey_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_has_survey" ADD CONSTRAINT "survey_by_teacher_student_fk" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
