const prismac = require('@prisma/client')

const prisma = new prismac.PrismaClient()

async function test() {
  const surveyGroups = await prisma.survey_group.findMany({
    include: {
      subject_reports: true,
      teacher_reports: true,
    }
  })
  const subjects = await prisma.subject.findMany()
  for(let s = 0; s < subjects.length; s++){
    for(let sg = 0; sg < surveyGroups.length; sg++){
      if(surveyGroups[sg].subject_reports.length == 0){
        generateAndUploadSubjectReport()
      }else if(reportExist(surveyGroups[sg].subject_reports, subjects[s].subject_id)){
        console.log("exist")
      }else{
        console.log("not exist")
      }
    }
  }
}

async function generateAndUploadSubjectReport(subjectId){


  await prisma.report_subject_emited.create({
    data: {
      subject_id: subjects[s].subject_id,
      survey_group_id: surveyGroups[sg].id,
    }
  })
}


function getMonthYear(datetime) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(datetime);
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${month} ${year}`;
}

function reportExist(array, targetId) {
  for(let i = 0; i < array.length; i++){
    if(array[i].subject_id == targetId){
      return true;
    }
    if(array[i].teacher_id == targetId){
      return true;
    }
  }
  return false;
}


test()