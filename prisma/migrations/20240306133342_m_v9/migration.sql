-- CreateTable
CREATE TABLE "parent" (
    "parent_id" INTEGER NOT NULL,
    "title" TEXT,
    "forename" TEXT,
    "surname" TEXT,
    "relationship_raw" TEXT,
    "parental_responsibility" TEXT,
    "parental_responsibility_contact_type" TEXT,
    "last_update_api_date" TEXT,
    "is_first_person_contact" BOOLEAN,
    "contact_id" INTEGER,
    "telephone" TEXT,
    "email_address" TEXT,
    "pupil_status" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("parent_id")
);

-- CreateTable
CREATE TABLE "family" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "last_update_api_date" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "family_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "family" ADD CONSTRAINT "fk_family_student" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family" ADD CONSTRAINT "fk_family_parent" FOREIGN KEY ("parent_id") REFERENCES "parent"("parent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
