import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  LECTURE_APPLICATION_REPOSITORY,
  LECTURE_REPOSITORY,
} from './lecture.di-tokens';
import { LectureRepository } from './database/lecture.repository';
import { USER_REPOSITORY } from '../user/user.di-tokens';
import { UserRepository } from '../user/database/user.repository';
import Lecture from './domain/lecture';
import LectureApplication from './domain/lecture-application';
import { LectureApplicationRepository } from './database/lecture-application.repository';
import { PRISMA_CLIENT } from '../../core/database/prisma.di-tokens';
import { PrismaService } from '../../core/database/prisma.service';

type ApplyType = {
  userId: string;
  lectureId: string;
};

@Injectable()
export class LectureService {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly prismaService: PrismaService,
    @Inject(LECTURE_REPOSITORY)
    private readonly lectureRepository: LectureRepository,
    @Inject(LECTURE_APPLICATION_REPOSITORY)
    private readonly lectureApplicationRepository: LectureApplicationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: Lecture): Promise<void> {
    await this.lectureRepository.create(data);
  }

  async isApplicationCompleted(userId: string): Promise<boolean> {
    const lectureApplication =
      await this.lectureApplicationRepository.findByUserId(userId);

    return !!lectureApplication;
  }

  async findAll(): Promise<Lecture[]> {
    return this.lectureRepository.findAll();
  }

  async applyPessimisticLock({ userId, lectureId }: ApplyType): Promise<void> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingApplication =
      await this.lectureApplicationRepository.findByUserId(userId);

    if (existingApplication) {
      throw new ConflictException('User already applied');
    }

    await this.prismaService.$transaction(async (tx) => {
      const lecture = await this.lectureRepository.findOneForUpdate(
        lectureId,
        tx,
      );

      if (!lecture) {
        throw new NotFoundException('Lecture not found');
      }

      if (lecture.isFull()) {
        throw new ConflictException('Lecture is full');
      }

      lecture.increaseCapacity();

      const lectureApplication = LectureApplication.create({
        userId,
        lectureId,
      });

      await this.lectureApplicationRepository.createWithUpdateLecture(
        lectureApplication,
        lecture,
        tx,
      );
    });
  }

  async applyWithOptimisticLock({
    userId,
    lectureId,
  }: ApplyType): Promise<void> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingApplication =
      await this.lectureApplicationRepository.findByUserId(userId);

    if (existingApplication) {
      throw new ConflictException('User already applied');
    }

    await this.prismaService.$transaction(async (tx) => {
      const lecture = await this.lectureRepository.findOneForUpdate(
        lectureId,
        tx,
      );

      if (!lecture) {
        throw new NotFoundException('Lecture not found');
      }

      if (lecture.isFull()) {
        throw new ConflictException('Lecture is full');
      }

      lecture.increaseCapacity();

      const lectureApplication = LectureApplication.create({
        userId,
        lectureId,
      });

      await this.lectureApplicationRepository.createWithUpdateLectureByOptimisticLock(
        lectureApplication,
        lecture,
        tx,
      );
    });
  }
}
