const { PrismaClient } = require( '@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function main() {
  let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  data = data.map((row) => {
    row.last_update_api_date = new Date(row.last_update_api_date);
    return row
  })
    prisma.set.createMany({
      data:data
    }).then((rowD) => {
      console.log(`Created id: ${rowD.set_id}`);
    }).catch((err) => {
      console.error(err)
      console.log(`Error id: ${row.set_id}`);
    });
  
  
}

main()