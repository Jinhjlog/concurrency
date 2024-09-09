import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LectureApplicationMapper } from '../lecture-application.mapper';
import { PRISMA_CLIENT } from '@core/database/prisma.di-tokens';
import { PrismaService } from '@core/database/prisma.service';
import LectureApplication from '@lecture/domain/lecture-application';

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

  async create(lectureApplication: LectureApplication): Promise<void> {
    await this.prismaService.lectureApplication.create({
      data: LectureApplicationMapper.toPersistence(lectureApplication),
    });
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
