import { Test, TestingModule } from '@nestjs/testing';
import { LectureModule } from './lecture.module';
import { CoreModule } from 'src/core/core.module';
import { PRISMA_CLIENT } from '@core/database/prisma.di-tokens';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { LectureService } from './lecture.service';
import { ulid } from 'ulid';

const mockUsers: {
  id: string;
  name: string;
}[] = Array.from({ length: 100 }, (_, index) => ({
  id: ulid(),
  name: `user_${index}`,
}));
const mockLecture: {
  id: string;
  title: string;
  maxCapacity: number;
  currentCapacity: number;
  date: Date;
  description: string;
} = {
  id: ulid(),
  title: '특강',
  maxCapacity: 100,
  currentCapacity: 0,
  date: new Date(),
  description: '특강',
};

describe('StockService', () => {
  let app: INestApplication;
  let lectureService: LectureService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LectureModule, CoreModule],
      providers: [
        PrismaService,
        {
          provide: PRISMA_CLIENT,
          useValue: {
            db: {
              url: process.env.DATABASE_URL,
            },
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    prismaService = module.get<PrismaService>(PrismaService);
    lectureService = module.get<LectureService>(LectureService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prismaService.user.createMany({
      data: mockUsers,
    });
    await prismaService.lecture.create({
      data: mockLecture,
    });
  });

  afterEach(async () => {
    await prismaService.lectureApplication.deleteMany();
    await prismaService.lecture.deleteMany();
    await prismaService.user.deleteMany();
  });

  describe('LectureService', () => {
    describe('apply', () => {
      it('특강 신청을 동시에 100명이 요청하면 실패한다', async () => {
        // given
        const applyRequests = Array.from({ length: 100 }, (_, index) =>
          lectureService.apply(mockUsers[index].id, mockLecture.id),
        );

        // when
        await Promise.all(applyRequests);

        // then
        const lecture = await prismaService.lecture.findUnique({
          where: { id: mockLecture.id },
        });
        expect(lecture?.currentCapacity).not.toBe(0);
      });
    });
  });
});
