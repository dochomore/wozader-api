import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication/authentication.service';
import { LocalAuthGuard } from './authentication/guard/local/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
