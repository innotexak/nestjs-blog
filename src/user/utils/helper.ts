import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UserUtils {
  constructor(private readonly jwtService: JwtService) {}
  async generateTokens(email: string) {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(
        { email: email },
        {
          secret: 'emakpe-estate-secret-access',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        { email: email },
        {
          secret: 'emakpe-estate-secret-refresh',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accessToken: access,
      refreshToken: refresh,
    };
  }
  async hashData(data: string) {
    return await hash(data, 10);
  }
  async hashAllTokens(aToken: string, rToken: string) {
    const aTokenHashed = await this.hashData(aToken);
    const rTokenHashed = await this.hashData(rToken);
    return { accessToken: aTokenHashed, refreshToken: rTokenHashed };
  }

  async decryptRefreshToken(token: string) {
    return this.jwtService.decode(token);
  }

  async compareToken(access1: string, access2: string) {
    return compare(access1, access2);
  }
}
