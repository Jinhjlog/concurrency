import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import {
  LECTURE_APPLICATION_REPOSITORY,
  LECTURE_REPOSITORY,
} from './lecture.di-tokens';
import { LectureRepository } from './database/lecture.repository';
import { LectureApplicationRepository } from './database/lecture-application.repository';
@Module({
  controllers: [LectureController],
  providers: [
    { provide: LECTURE_REPOSITORY, useClass: LectureRepository },
    {
      provide: LECTURE_APPLICATION_REPOSITORY,
      useClass: LectureApplicationRepository,
    },
  ],
})
export class LectureModule {}
