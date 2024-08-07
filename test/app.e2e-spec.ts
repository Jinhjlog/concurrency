import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  const firstUserId = ulid();
  const secondUserId = ulid();
  const thirdUserId = ulid();
  const lectureId = ulid();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // 테스트 데이터 생성
    await prisma.lecture.create({
      data: {
        id: lectureId,
        title: 'Test Lecture',
        description: 'Test Description',
        maxCapacity: 2,
        currentCapacity: 0,
        date: new Date(),
      },
    });

    await prisma.user.createMany({
      data: [
        { id: firstUserId, name: 'user1' },
        { id: secondUserId, name: 'user2' },
        { id: thirdUserId, name: 'user3' },
      ],
    });
  });

  afterEach(async () => {
    await prisma.lectureApplication.deleteMany();
    await prisma.lecture.deleteMany();
    await prisma.user.deleteMany();
  });

  it('최대 수강 인원을 초과하는 경우 에러를 반환합니다.', async () => {
    const user1 = { userId: firstUserId, lectureId: lectureId };
    const user2 = { userId: secondUserId, lectureId: lectureId };
    const user3 = { userId: thirdUserId, lectureId: lectureId };

    // 동시성 테스트
    const applyPromises = [
      request(app.getHttpServer()).post('/lectures/apply').send(user1),
      request(app.getHttpServer()).post('/lectures/apply').send(user2),
      request(app.getHttpServer()).post('/lectures/apply').send(user3),
    ];

    await Promise.all(applyPromises);

    const updatedLecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
    });

    expect(updatedLecture.currentCapacity).toBe(2);
  });
});
