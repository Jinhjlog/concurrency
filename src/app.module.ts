import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [CoreModule, UserModule],
})
export class AppModule {}
