import {
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  LECTURE_APPLICATION_REPOSITORY,
  LECTURE_REPOSITORY,
} from './lecture.di-tokens';
import { LectureRepository } from './database/lecture.repository';
import { USER_REPOSITORY } from '../user/user.di-tokens';
import { UserRepository } from '../user/database/user.repository';
import Lecture from './domain/lecture';
import { LectureApplicationRepository } from './database/lecture-application.repository';
import LectureApplication from './domain/lecture-application';

type ApplyType = {
  userId: string;
  lectureId: string;
};

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

  async apply({ userId, lectureId }: ApplyType): Promise<void> {
    await this.lectureRepository.transactionWithSerializable(async (tx) => {

      const user = await this.userRepository.findByIdWithPessimisticLock(
        userId, tx
      );

      if (!user) {
        throw new Error('User not found');
      }

      const lecture = await this.lectureRepository.findByIdWithPessimisticLock(
        lectureId, tx
      );

      if (!lecture) {
        throw new Error('Lecture not found');
      }

      const isFull = lecture.isFull();
      
      if (isFull) {
        throw new Error('Lecture is full');
      }

      lecture.increaseCapacity();

      const lectureApplication = LectureApplication.create({
        lectureId,
        userId,
      });

      await this.lectureApplicationRepository.createWithPessimisticLock(
        lectureApplication,
        tx
      )

      await this.lectureRepository.updateWithPessimisticLock(
        lecture,
        tx
      );
    });
  }
}