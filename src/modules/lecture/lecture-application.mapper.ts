import { Injectable } from '@nestjs/common';
import { LectureApplicationModel } from './database/lecture-application.repository';
import LectureApplication from './domain/lecture-application';
@Injectable()
export class LectureApplicationMapper {
  static toPersistence(
    lectureApplication: LectureApplication,
  ): LectureApplicationModel {
    return {
      id: lectureApplication.id,
      userId: lectureApplication.userId,
      lectureId: lectureApplication.lectureId,
      applicationDate: lectureApplication.applicationDate,
    };
  }

  static toDomain(model: LectureApplicationModel): LectureApplication {
    return new LectureApplication({
      id: model.id,
      userId: model.userId,
      lectureId: model.lectureId,
      applicationDate: model.applicationDate,
    });
  }
}
