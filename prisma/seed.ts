import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.deleteMany({});
  await prisma.lecture.deleteMany({});

  const users = await createUsers(10);

  prisma.user.createMany({
    data: users,
  });

  const lectures = await createLectures(10);

  await prisma.lecture.createMany({
    data: lectures,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function createUsers(count: number) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = await prisma.user.create({
      data: {
        id: ulid(),
        name: `User ${i + 1}`,
      },
    });
    users.push(user);
  }
  return users;
}

async function createLectures(count: number) {
  const lectures = [];
  for (let i = 0; i < count; i++) {
    lectures.push({
      id: ulid(),
      title: `Lecture ${i + 1}`,
      description: `Description for Lecture ${i + 1}`,
      maxCapacity: Math.floor(Math.random() * 30) + 20, // 20 to 50
      currentCapacity: 0,
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within next 30 days
    });
  }
  return lectures;
}
