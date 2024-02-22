const { PrismaClient } = require( '@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function main() {
  let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  data = data.map((row) => {
    row.last_update_api_date = new Date(row.last_update_api_date);
    return row
  })
  for (const row of data) {
    prisma.subject.create({
      data: row
    }).then((rowD) => {
      console.log(`Created id: ${rowD.subject_id}`);
    }).catch((err) => {
      console.log(err)
      console.log(`Error id: ${row.subject_id}`);
    });
  }
}

main()



