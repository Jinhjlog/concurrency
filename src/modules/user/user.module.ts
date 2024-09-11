import { Module } from '@nestjs/common';
import { UserRepository } from './database/user.repository';
import { USER_REPOSITORY } from './user.di-tokens';

@Module({
  providers: [{ provide: USER_REPOSITORY, useClass: UserRepository }],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
