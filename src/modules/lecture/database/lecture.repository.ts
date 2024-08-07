import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PRISMA_CLIENT } from '../../../core/database/prisma.di-tokens';
import { PrismaService } from '../../../core/database/prisma.service';
import Lecture from '../domain/lecture';
import { LectureMapper } from '../lecture.mapper';

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
export class LectureRepository {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly prismaService: PrismaService,
  ) {}

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

  async findOne(id: string): Promise<Lecture | null> {
    const lecture = await this.prismaService.lecture.findUnique({
      where: { id },
      ...validation,
    });

    return lecture ? LectureMapper.toDomain(lecture) : null;
  }

  async findOneForUpdate(
    lectureId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Lecture | null> {
    const [lectures] = await (tx || this.prismaService).$queryRaw<
      LectureRawQueryModel[]
    >`SELECT * FROM \`lectures\` WHERE lecture_id = ${lectureId} FOR UPDATE`;

    return lectures ? LectureMapper.rawQueryToDomain(lectures) : null;
  }
}
