import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  IPasswordInterface,
  IUserCreationDto,
  IUserLoginDto,
  IUserUpdate,
  IUserPasswordChange,
  JwtPayload,
  ResponseStatus,
} from './types';
import { UserService } from './user.service';
import { GetCurrentUser } from './common/decorators';

import { AtGuard, RtGuard } from './common/guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('all')
  getAllUsers(): Promise<ResponseStatus> {
    return this.userService.getUsers();
  }

  @Get('single')
  getUserById(@Query('token') token: string): Promise<ResponseStatus> {
    return this.userService.getSingleUser({ accessToken: token });
  }

  @Post('register')
  create(@Body() iUserCreationDto: IUserCreationDto): Promise<ResponseStatus> {
    return this.userService.createUser(iUserCreationDto);
  }

  @Post('login')
  loginUser(@Body() iUserLoginDto: IUserLoginDto): Promise<ResponseStatus> {
    return this.userService.loginUser(iUserLoginDto);
  }

  @Patch('update')
  updateUser(@Body() iUserUpdate: IUserUpdate): Promise<ResponseStatus> {
    return this.userService.updateUser(iUserUpdate);
  }

  @Delete('delete/')
  deleteUser(@Query('userId') id: string) {
    return this.userService.delUser(id);
  }

  @Get('activate')
  activateAccount(@Query('token') token: string): Promise<ResponseStatus> {
    return this.userService.activateAccount(token);
  }

  @Post('forgot')
  forgotPassword(@Body() jwtPayload: JwtPayload): Promise<ResponseStatus> {
    return this.userService.forgotPassword(jwtPayload.email);
  }

  @Patch('reset')
  resetPassword(
    @Body() iPasswordInterface: IPasswordInterface,
  ): Promise<ResponseStatus> {
    return this.userService.resetPassword(iPasswordInterface);
  }

  @Post('change')
  changePassword(
    @Body() iUserPasswordChange: IUserPasswordChange,
  ): Promise<ResponseStatus> {
    return this.userService.change(iUserPasswordChange);
  }

  @Post('resend/mail')
  resendMail(@Body() data: JwtPayload): Promise<ResponseStatus> {
    return this.userService.resendMail(data.email);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() data: any): Promise<ResponseStatus> {
    return this.userService.logout(data.email);
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  refreshToken(
    @GetCurrentUser('email') userEmail: string,
  ): Promise<ResponseStatus> {
    return this.userService.refreshToken(userEmail);
  }
}
