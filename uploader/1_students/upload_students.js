const { PrismaClient } = require( '@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function main() {
  const data = JSON.parse(fs.readFileSync('students.json', 'utf8'));

  for (const student of data) {
    prisma.student.create({
      data: {
        student_id: student.student_id,
        person_id: student.person_id,
        family_Id: student.family_Id,
        title: student.title,
        forename: student.forename,
        surname: student.surname,
        middle_name: student.middle_name,
        initials: student.initials,
        preferred_name: student.preferred_name,
        fullname: `${student.title} ${student.forename} ${student.surname}`,
        gender: student.gender,
        form: student.form,
        email_address: student.email_address,
        pupil_type: student.pupil_type,
        enrolment_date: student.enrolment_date,
        enrolment_school_year: student.enrolment_school_year,
        password: student.password,
      },
    }).then((user) => {
        console.log(`Created user: ${user.student_id}`);
    });
  }
}

main()

