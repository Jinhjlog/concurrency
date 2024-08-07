import { Injectable } from '@nestjs/common';
import { LectureResponseDto } from './dtos/lecture-reponse.dto';
import Lecture from './domain/lecture';
import {
  LectureModel,
  LectureRawQueryModel,
} from './database/lecture.repository';

@Injectable()
export class LectureMapper {
  static toPersistence(lecture: Lecture): LectureModel {
    return {
      id: lecture.id,
      title: lecture.title,
      description: lecture.description,
      maxCapacity: lecture.maxCapacity,
      currentCapacity: lecture.currentCapacity,
      date: lecture.date,
      updatedAt: lecture.updatedAt,
    };
  }

  static toDomain(model: LectureModel): Lecture {
    return new Lecture({
      id: model.id,
      title: model.title,
      description: model.description,
      maxCapacity: model.maxCapacity,
      currentCapacity: model.currentCapacity,
      date: model.date,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(lectue: Lecture): LectureResponseDto {
    return {
      id: lectue.id,
      title: lectue.title,
      description: lectue.description,
      maxCapacity: lectue.maxCapacity,
      currentCapacity: lectue.currentCapacity,
      date: lectue.date,
    };
  }

  static rawQueryToDomain(model: LectureRawQueryModel): Lecture {
    return new Lecture({
      id: model.lecture_id,
      title: model.title,
      description: model.name,
      maxCapacity: model.max_capacity,
      currentCapacity: model.current_capacity,
      date: model.date,
      updatedAt: model.updated_at,
    });
  }
}
