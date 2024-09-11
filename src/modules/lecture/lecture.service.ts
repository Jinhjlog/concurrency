import { Inject, Injectable } from '@nestjs/common';
import {
  LECTURE_APPLICATION_REPOSITORY,
  LECTURE_REPOSITORY,
} from './lecture.di-tokens';
import Lecture from './domain/lecture';
import { LectureApplicationRepository } from './database/lecture-application.repository';
import LectureApplication from './domain/lecture-application';
import {
  AlreadyAppliedUserException,
  LectureCapacityExceededException,
  NotFoundLectureException,
  NotFoundUserException,
} from '@common/errors';
import { LectureRepository } from './database/lecture.repository';
import { USER_REPOSITORY } from '@user/user.di-tokens';
import { UserRepository } from '@user/database/user.repository';

@Injectable()
export class LectureService {
  constructor(
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

  async apply(userId: string, lectureId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundUserException();
    }

    const lecture = await this.lectureRepository.findById(lectureId);

    if (!lecture) {
      throw new NotFoundLectureException();
    }

    const isFull = lecture.isOverCapacity();

    if (isFull) {
      throw new LectureCapacityExceededException();
    }

    const existingUserApplication =
      await this.lectureApplicationRepository.findByUserId(userId);

    if (existingUserApplication) {
      throw new AlreadyAppliedUserException();
    }

    lecture.increaseCapacity();

    const lectureApplication = LectureApplication.create({
      lectureId,
      userId,
    });

    await this.lectureApplicationRepository.create(lectureApplication);

    await this.lectureRepository.update(lecture);
  }
}
