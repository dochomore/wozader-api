import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from 'src/user/user.module';
import { LocalAuthStrategy } from './strategy/local/local-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalAuthStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
