import { Injectable, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user.service';
import { JwtPayload } from '../types';
import { Request } from 'express';

@Injectable()
export class RefreshToken extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'emakpe-estate-secret-refresh',
      passReqToCallback: true,
    });
  }

  async validate(@Req() req: Request, payload: JwtPayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}
