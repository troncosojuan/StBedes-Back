const prismac = require('@prisma/client')

const prisma = new prismac.PrismaClient()

async function test() {
  const surveys = await prisma.survey.findMany()
  surveys.forEach(async (survey) => {
    //console.log(survey)
    //console.log(getMonthYear(survey.created_at))
    await prisma.survey.update({
      data: {
        identifier: getMonthYear(survey.created_at)
      },
      where: {
        survey_id: survey.survey_id
      }
    })
  })

  const surveysTeacher = await prisma.survey_teacher.findMany()
  surveysTeacher.forEach(async (survey) => {
    //console.log(survey)
    //console.log(getMonthYear(survey.created_at))
    await prisma.survey_teacher.update({
      data: {
        identifier: getMonthYear(survey.created_at)
      },
      where: {
        survey_teacher_id: survey.survey_teacher_id
      }
    })
  })
}

function getMonthYear(datetime) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(datetime);
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${month} ${year}`;
}

test()