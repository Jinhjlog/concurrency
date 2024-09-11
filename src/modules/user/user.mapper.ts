import User from './domain/user';
import { UserModel } from './database/user.repository';

export class UserMapper {
  static toPersistence(user: User): UserModel {
    return {
      id: user.id,
      name: user.name,
    };
  }

  static toDomain({ id, name }: UserModel): User {
    return new User({ id, name });
  }
}
