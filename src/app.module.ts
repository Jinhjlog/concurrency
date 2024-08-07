import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { LectrueModule } from './modules/lecture/lecture.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [CoreModule, LectrueModule, UserModule],
})
export class AppModule {}
