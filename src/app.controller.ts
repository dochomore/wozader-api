import { Controller } from '@nestjs/common';
import { AuthenticationService } from './authentication/authentication.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthenticationService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
