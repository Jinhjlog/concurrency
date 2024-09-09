import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { LectureModule } from './modules/lecture/lecture.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [CoreModule, LectureModule, UserModule],
})
export class AppModule {}
