import { Injectable } from '@nestjs/common';
import User from './domain/user';
import { UserModel } from './database/user.repository';

@Injectable()
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
