import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  signin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@Request() req) {
    const userId = req.user['sub'];
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Request() req) {
    const username = req.user['username'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(username, refreshToken);
  }
}
