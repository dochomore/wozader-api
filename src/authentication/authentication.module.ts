import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from 'src/user/user.module';
import { LocalAuthStrategy } from './strategy/local/local-auth.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalAuthStrategy],
})
export class AuthenticationModule {}
