import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (user instanceof User) {
      if (await bcrypt.compare(password, user.password)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...others } = user;
        return others;
      }
    }
    return null;
  }

  async login(user: any) {
    const tokens = await this.getTokens(user.userId, user.username);
    await this.updateRefreshToken(user.userId, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await this.userService.encrypt(refreshToken);
    return await this.userService.updateRefreshToken(userId, hashedToken);
  }

  async logout(userId: string) {
    return await this.userService.updateRefreshToken(userId, null);
  }

  async refreshToken(username: string, refreshToken: string) {
    const user = await this.userService.findOneByUsername(username);
    if (user instanceof NotFoundException) {
      return new ForbiddenException();
    }

    if (!user || !user.refreshToken) {
      return new NotFoundException();
    }
    const refreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatch) return new ForbiddenException('Acces Denied');
    const tokens = await this.getTokens(user.userId, user.username);
    await this.updateRefreshToken(user.userId, tokens.refreshToken);
    return tokens;
  }
  private readonly JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET';
  private readonly JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET';

  getTokens = async (userId: string, username: string) => {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username },
        {
          secret: this.configService.get<string>(this.JWT_ACCESS_SECRET),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username },
        {
          secret: this.configService.get<string>(this.JWT_REFRESH_SECRET),
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  };
}
