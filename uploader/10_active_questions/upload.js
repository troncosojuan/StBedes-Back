const { PrismaClient } = require( '@prisma/client')
const fs = require('fs')
const csv = require('csv-parser');

const prisma = new PrismaClient()

async function main() {
  let data = []
  fs.createReadStream("data.csv")
  .pipe(csv())
  .on('data', (row) => {
      data.push(row)
  })
  .on('end', () => {
    console.log(data)
  });
  
}

main()