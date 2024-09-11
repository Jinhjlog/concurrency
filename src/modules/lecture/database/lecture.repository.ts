import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LectureMapper } from '../lecture.mapper';
import { PRISMA_CLIENT } from '@core/database/prisma.di-tokens';
import { PrismaService } from '@core/database/prisma.service';
import Lecture from '@lecture/domain/lecture';
import { BaseRepository } from 'src/repository/base-respository';

export type LectureModel = Prisma.LectureGetPayload<typeof validation>;
export type LectureRawQueryModel = {
  lecture_id: string;
  title: string;
  name: string;
  max_capacity: number;
  current_capacity: number;
  date: Date;
  updated_at: Date;
};

const validation = Prisma.validator<Prisma.LectureDefaultArgs>()({
  select: {
    id: true,
    title: true,
    description: true,
    maxCapacity: true,
    currentCapacity: true,
    date: true,
    updatedAt: true,
  },
});

@Injectable()
export class LectureRepository extends BaseRepository {
  constructor(@Inject(PRISMA_CLIENT) readonly prismaService: PrismaService) {
    super(prismaService);
  }

  async create(data: Lecture): Promise<Lecture> {
    const lecture = await this.prismaService.lecture.create({
      data: LectureMapper.toPersistence(data),
    });

    return LectureMapper.toDomain(lecture);
  }

  async findAll(): Promise<Lecture[]> {
    const lectures = await this.prismaService.lecture.findMany({
      ...validation,
    });

    return lectures.map(LectureMapper.toDomain);
  }

  async findById(id: string): Promise<Lecture | null> {
    const lecture = await this.prismaService.lecture.findUnique({
      where: { id },
      ...validation,
    });

    return lecture ? LectureMapper.toDomain(lecture) : null;
  }

  async findByIdWithPessimisticLock(
    id: string,
    tx: Prisma.TransactionClient,
  ): Promise<Lecture | null> {
    const lectures = await tx.$queryRaw<LectureRawQueryModel[]>`
      SELECT * FROM lectures WHERE lecture_id = ${id} FOR UPDATE;
    `;

    return lectures.length ? LectureMapper.rawQueryToDomain(lectures[0]) : null;
  }

  async update(lecture: Lecture): Promise<void> {
    await this.prismaService.lecture.update({
      where: { id: lecture.id },
      data: LectureMapper.toPersistence(lecture),
    });
  }

  async updateWithPessimisticLock(
    lecture: Lecture,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.lecture.update({
      where: { id: lecture.id },
      data: LectureMapper.toPersistence(lecture),
    });
  }
}
