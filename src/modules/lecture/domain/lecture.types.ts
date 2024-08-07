export interface LectureProps {
  id: string;
  title: string;
  description: string;
  maxCapacity: number;
  currentCapacity: number;
  date: Date;
  updatedAt: Date;
}

export interface CreateLectureProps {
  title: string;
  description: string;
  maxCapacity: number;
  date: Date;
}
