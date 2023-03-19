import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RefreshToken } from './strategies/refresh.tokens';
import { AccessToken } from './strategies/access.tokens';
import { UserUtils } from './utils';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
    PassportModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService, UserUtils, AccessToken, RefreshToken],
  exports: [UserService],
})
export class UserModule {}
