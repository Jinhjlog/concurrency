import { Module } from '@nestjs/common';
import { UserRepository } from './database/user.repository';
import { UserMapper } from './user.mapper';
import { USER_REPOSITORY } from './user.di-tokens';

@Module({
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    UserMapper,
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
