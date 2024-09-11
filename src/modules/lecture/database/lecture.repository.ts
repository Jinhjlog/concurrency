import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LectureMapper } from '../lecture.mapper';
import { PRISMA_CLIENT } from '@core/database/prisma.di-tokens';
import { PrismaService } from '@core/database/prisma.service';
import Lecture from '@lecture/domain/lecture';

export type LectureModel = Prisma.LectureGetPayload<typeof validation>;

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
export class LectureRepository {
  constructor(@Inject(PRISMA_CLIENT) readonly prismaService: PrismaService) {}

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

  async update(lecture: Lecture): Promise<void> {
    await this.prismaService.lecture.update({
      where: { id: lecture.id },
      data: LectureMapper.toPersistence(lecture),
    });
  }
  s;
}
