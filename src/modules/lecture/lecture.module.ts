import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import {
  LECTURE_APPLICATION_REPOSITORY,
  LECTURE_REPOSITORY,
} from './lecture.di-tokens';
import { LectureRepository } from './database/lecture.repository';
import { UserModule } from '../user/user.module';
import { LectureApplicationRepository } from './database/lecture-application.repository';
import { LecturePessimisticService } from './lecture-pessimistic.service';

@Module({
  imports: [UserModule],
  controllers: [LectureController],
  providers: [
    LectureService,
    LecturePessimisticService,
    { provide: LECTURE_REPOSITORY, useClass: LectureRepository },
    {
      provide: LECTURE_APPLICATION_REPOSITORY,
      useClass: LectureApplicationRepository,
    },
  ],
})
export class LectureModule {}
