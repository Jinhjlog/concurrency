export interface UserProps {
  id: string;
  name: string;
  applications?: LectureApplication[];
}

export interface LectureApplication {
  lectureApplicationId: string;
  applicationDate: Date;
}

export interface CreateUserProps {
  name: string;
}
