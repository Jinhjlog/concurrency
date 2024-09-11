import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
@Module({
  controllers: [LectureController],
})
export class LectureModule {}
