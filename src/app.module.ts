import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './modules/user/user.module';
import { LectureModule } from '@lecture/lecture.module';

@Module({
  imports: [CoreModule, UserModule, LectureModule],
})
export class AppModule {}
