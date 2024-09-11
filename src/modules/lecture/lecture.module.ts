import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import {
  LECTURE_APPLICATION_REPOSITORY,
  LECTURE_REPOSITORY,
} from './lecture.di-tokens';
import { LectureRepository } from './database/lecture.repository';
import { LectureApplicationRepository } from './database/lecture-application.repository';
import { LectureService } from './lecture.service';
import { UserModule } from '@user/user.module';
@Module({
  imports: [UserModule],
  controllers: [LectureController],
  providers: [
    LectureService,
    { provide: LECTURE_REPOSITORY, useClass: LectureRepository },
    {
      provide: LECTURE_APPLICATION_REPOSITORY,
      useClass: LectureApplicationRepository,
    },
  ],
})
export class LectureModule {}
