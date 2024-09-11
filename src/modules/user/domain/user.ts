import { ulid } from 'ulid';
import { CreateUserProps, UserProps } from './user.types';

export default class User implements UserProps {
  id: string;
  name: string;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
  }

  static create(props: CreateUserProps): User {
    return new User({
      id: ulid(),
      name: props.name,
    });
  }
}
