const { PrismaClient } = require( '@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function main() {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const rows = data.map((row) => {
    return {
      set_list_id: row.set_list_id,
      set_id: row.set_id,
      student_id: row.student_id,
      last_update_api_date: new Date(row.last_update_api_date)
    }
  })
  prisma.set_list.createMany({
    data: rows
  }).then((rowD) => {
    console.log(`Created`);
  }).catch((err) => {
    console.error(err)
  });
  
}

main()