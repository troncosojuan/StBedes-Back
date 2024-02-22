const { PrismaClient } = require( '@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function main() {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  prisma.question_by_student.createMany({
    data: data
  }).then((rowD) => {
    console.log(`Created`);
  }).catch((err) => {
    console.error(err)
  });
  
}

main()