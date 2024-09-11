import Lecture from './domain/lecture';
import { LectureResponseDto } from './dtos';

export class LectureTransformer {
  static toResponse(lecture: Lecture): LectureResponseDto {
    return {
      id: lecture.id,
      title: lecture.title,
      description: lecture.description,
      maxCapacity: lecture.maxCapacity,
      currentCapacity: lecture.currentCapacity,
      date: lecture.date,
    };
  }
}
