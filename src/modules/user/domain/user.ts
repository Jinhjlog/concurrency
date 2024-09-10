import { ulid } from 'ulid';
import { CreateUserProps, UserProps, LectureApplication } from './user.types';

export default class User implements UserProps {
  id: string;
  name: string;
  applications?: LectureApplication[];

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.applications = props.applications;
  }

  static create(props: CreateUserProps): User {
    return new User({
      id: ulid(),
      name: props.name,
    });
  }
}
