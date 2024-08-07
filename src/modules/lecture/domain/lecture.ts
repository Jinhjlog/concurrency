import { ulid } from 'ulid';
import { CreateLectureProps, LectureProps } from './lecture.types';

export default class Lecture implements LectureProps {
  id: string;
  title: string;
  description: string;
  maxCapacity: number;
  currentCapacity: number;
  date: Date;
  updatedAt: Date;

  constructor(props: LectureProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.maxCapacity = props.maxCapacity;
    this.currentCapacity = props.currentCapacity;
    this.date = props.date;
    this.updatedAt = props.updatedAt;
  }

  static create(props: CreateLectureProps): Lecture {
    return new Lecture({
      id: ulid(),
      title: props.title,
      description: props.description,
      maxCapacity: props.maxCapacity,
      currentCapacity: 0,
      date: props.date,
      updatedAt: new Date(),
    });
  }

  isFull(): boolean {
    return this.currentCapacity >= this.maxCapacity;
  }

  increaseCapacity(): void {
    this.currentCapacity += 1;
  }
}
