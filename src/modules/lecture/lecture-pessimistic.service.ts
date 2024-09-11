import { Inject, Injectable } from '@nestjs/common';
import {
  LECTURE_APPLICATION_REPOSITORY,
  LECTURE_REPOSITORY,
} from './lecture.di-tokens';
import { LectureRepository } from './database/lecture.repository';
import { LectureApplicationRepository } from './database/lecture-application.repository';
import LectureApplication from './domain/lecture-application';
import {
  LectureCapacityExceededException,
  NotFoundLectureException,
  NotFoundUserException,
} from '@common/errors';
import { UserRepository } from '@user/database/user.repository';
import { USER_REPOSITORY } from '@user/user.di-tokens';

@Injectable()
export class LecturePessimisticService {
  constructor(
    @Inject(LECTURE_REPOSITORY)
    private readonly lectureRepository: LectureRepository,
    @Inject(LECTURE_APPLICATION_REPOSITORY)
    private readonly lectureApplicationRepository: LectureApplicationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async apply(userId: string, lectureId: string): Promise<void> {
    await this.lectureRepository.transactionWithSerializable(async (tx) => {
      const user = await this.userRepository.findByIdWithPessimisticLock(
        userId,
        tx,
      );

      if (!user) {
        throw new NotFoundUserException();
      }

      const lecture = await this.lectureRepository.findByIdWithPessimisticLock(
        lectureId,
        tx,
      );

      if (!lecture) {
        throw new NotFoundLectureException();
      }

      const isFull = lecture.isOverCapacity();

      if (isFull) {
        throw new LectureCapacityExceededException();
      }

      lecture.increaseCapacity();

      const lectureApplication = LectureApplication.create({
        lectureId,
        userId,
      });

      await this.lectureApplicationRepository.createWithTransaction(
        lectureApplication,
        tx,
      );

      await this.lectureRepository.updateWithTransaction(lecture, tx);
    });
  }
}
