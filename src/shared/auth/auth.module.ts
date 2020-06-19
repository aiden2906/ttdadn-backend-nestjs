import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

const passportConfig = PassportModule.register({
  defaultStrategy: 'jwt',
  property: 'user',
});

@Global()
@Module({
  imports: [UserModule, PassportModule, passportConfig],
  providers: [AuthService, LocalStrategy],
  exports: [passportConfig, AuthService],
})
export class AuthModule {}
