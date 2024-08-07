import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './database/user.repository';
import { UserMapper } from './user.mapper';
import { USER_REPOSITORY } from './user.di-tokens';

@Module({
  providers: [
    UserService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    UserMapper,
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
