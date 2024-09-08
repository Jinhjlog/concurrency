import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from './user.di-tokens';
import { UserRepository } from './database/user.repository';
import User from './domain/user';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userReposigtory: UserRepository,
  ) {}

  async find(userId: string): Promise<User> {
    const user = await this.userReposigtory.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
