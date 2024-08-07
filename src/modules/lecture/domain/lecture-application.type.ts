export interface LectureApplicationProps {
  id: string;
  userId: string;
  lectureId: string;
  applicationDate: Date;
}

export interface CreateLectureApplicationProps {
  userId: string;
  lectureId: string;
}
