import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PRISMA_CLIENT } from '../../../core/database/prisma.di-tokens';
import { PrismaService } from '../../../core/database/prisma.service';
import Lecture from '../domain/lecture';
import { LectureApplicationMapper } from '../lecture-application.mapper';
import { LectureMapper } from '../lecture.mapper';
import LectureApplication from '../domain/lecture-application';

export type LectureApplicationModel = Prisma.LectureApplicationGetPayload<
  typeof validation
>;

const validation = Prisma.validator<Prisma.LectureApplicationDefaultArgs>()({
  select: {
    id: true,
    userId: true,
    lectureId: true,
    applicationDate: true,
  },
});

@Injectable()
export class LectureApplicationRepository {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly prismaService: PrismaService,
  ) {}

  async createWithUpdateLecture(
    LectureApplication: LectureApplication,
    Lecture: Lecture,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.lectureApplication.create({
      data: LectureApplicationMapper.toPersistence(LectureApplication),
    });

    await tx.lecture.update({
      where: { id: Lecture.id },
      data: LectureMapper.toPersistence(Lecture),
    });
  }

  async createWithUpdateLectureByOptimisticLock(
    LectureApplication: LectureApplication,
    Lecture: Lecture,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.lectureApplication.create({
      data: LectureApplicationMapper.toPersistence(LectureApplication),
    });

    const updatedLecture = await tx.lecture.updateMany({
      where: { id: Lecture.id, updatedAt: Lecture.updatedAt },
      data: { ...LectureMapper.toPersistence(Lecture), updatedAt: new Date() },
    });

    if (updatedLecture.count === 0) {
      throw new Error('Conflict detected');
    }
  }

  async findByUserId(userId: string): Promise<LectureApplication | null> {
    const lectureApplication =
      await this.prismaService.lectureApplication.findUnique({
        where: { userId },
        ...validation,
      });

    return lectureApplication
      ? LectureApplicationMapper.toDomain(lectureApplication)
      : null;
  }

  async createWithPessimisticLock(
    lectureApplication: LectureApplication,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    await prisma.lectureApplication.create({
      data: LectureApplicationMapper.toPersistence(lectureApplication),
    });
  } 
}
