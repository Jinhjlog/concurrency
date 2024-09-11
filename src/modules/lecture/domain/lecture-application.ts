import { ulid } from 'ulid';
import {
  CreateLectureApplicationProps,
  LectureApplicationProps,
} from './lecture-application.type';

export default class LectureApplication implements LectureApplicationProps {
  id: string;
  userId: string;
  lectureId: string;
  applicationDate: Date;

  constructor(props: LectureApplicationProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.lectureId = props.lectureId;
    this.applicationDate = props.applicationDate;
  }

  static create(props: CreateLectureApplicationProps): LectureApplication {
    return new LectureApplication({
      id: ulid(),
      userId: props.userId,
      lectureId: props.lectureId,
      applicationDate: new Date(),
    });
  }
}
