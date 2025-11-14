const {PrismaClient} = require("../lib/generated/prisma")

const pitchTypes = [

]


const prisma = new PrismaClient();
async function main() {
    const pitches = await prisma.pitchType.createMany({
        data: pitchTypes

    })
    console.log(pitches)
}

main()
.then(async() => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1) 
})