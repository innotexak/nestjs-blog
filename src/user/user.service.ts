import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

import {
  IMailInterface,
  IPasswordInterface,
  IUserCreationDto,
  IUserLoginDto,
  IUserUpdate,
  ResponseStatus,
  IUserPasswordChange,
} from './types/interface';
import { MailService } from '../mail/mail.service';
import { UserUtils } from './utils';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  [x: string]: any;
  constructor(
    @InjectModel(User.name) private userRepository: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly userUtils: UserUtils,
  ) {}

  logger = new Logger('userService');

  async getSingleUser(filter: Record<string, any>): Promise<ResponseStatus> {
    const user = this.userRepository.findOne(filter);
    if (!user) throw new NotFoundException('User not found');

    const res: ResponseStatus = {
      statusCode: HttpStatus.OK,
      message: 'successfully retrieved',
      data: user,
    };
    return res;
  }

  async getUsers(): Promise<ResponseStatus> {
    const allUsers = await this.userRepository.find({});
    if (allUsers.length < 1) {
      throw new NotFoundException('You have no user');
    }
    const res: ResponseStatus = {
      statusCode: HttpStatus.OK,
      message: 'users successfully retrieved',
      data: allUsers,
    };
    return res;
  }

  async getUserById(id: string): Promise<ResponseStatus> {
    const foundUser = await this.userRepository.findById({ _id: id });
    delete foundUser.password;
    if (!foundUser) {
      throw new NotFoundException('No user match the provided query');
    }
    const res: ResponseStatus = {
      statusCode: HttpStatus.OK,
      message: 'User retrieved',
      data: foundUser,
    };
    return res;
  }

  async createUser(userCreationDto: IUserCreationDto): Promise<ResponseStatus> {
    const existUser = await this.userRepository.findOne({
      email: userCreationDto.email,
    });

    if (existUser) {
      throw new BadRequestException('Email already exist');
    }

    const tokens = await this.userUtils.generateTokens(userCreationDto.email);

    const hashedPassword = await this.userUtils.hashData(
      userCreationDto.password,
    );
    const refreshToken = await this.userUtils.hashData(tokens.refreshToken);
    const saveUser = await this.userRepository.create({
      ...userCreationDto,
      password: hashedPassword,
      accessToken: tokens.accessToken,
      refreshToken,
    });

    const response = (await saveUser.save()).toJSON();
    const { email, firstName, lastName } = response;
    const mailToken: IMailInterface = {
      accessToken: tokens.accessToken,
      firstName,
      lastName,
      email,
    };
    const mailSent = await this.mailService.accountActivationMail(mailToken);

    if (mailSent) {
      return {
        message: `Please check ${email} for account activation`,
        statusCode: HttpStatus.CREATED,
        data: response,
      };
    } else {
      return {
        statusCode: HttpStatus.EXPECTATION_FAILED,
        message: 'Activation mail not sent, please login to continue! ',
        data: response,
      };
    }
  }

  async loginUser(loginData: IUserLoginDto): Promise<ResponseStatus> {
    const loggedUser = await this.userRepository.findOne({
      email: loginData.email,
    });

    if (!loggedUser) {
      throw new ForbiddenException('Access denied, email not found');
    } else if (loggedUser.isActive === false) {
      throw new HttpException(
        'Account not activated, check your mail for activation',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const pass = await compare(loginData.password, loggedUser.password);
    if (!pass) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.userUtils.generateTokens(loggedUser.email);

    delete loggedUser.password;
    delete loggedUser.accessToken;
    delete loggedUser.refreshToken;
    const { firstName, lastName, userName, email } = loggedUser;
    const response: ResponseStatus = {
      message: `You are logged in`,
      statusCode: HttpStatus.OK,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        firstName,
        lastName,
        userName,
        email,
      },
    };

    if (
      await this.userUtils.hashAllTokens(
        tokens.accessToken,
        tokens.refreshToken,
      )
    ) {
      await this.userRepository.updateOne(
        { id: loggedUser._id },
        {
          accesstoken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        { new: true },
      );
      return response;
    }
  }

  async resendMail(email: string): Promise<ResponseStatus> {
    const {
      accessToken,
      firstName,
      lastName,
    } = await this.userRepository.findOne({ email: email });
    const mailToken: IMailInterface = {
      accessToken,
      firstName,
      lastName,
      email,
    };

    const response = await this.mailService.accountActivationMail(mailToken);
    if (response) {
      return {
        message: `Please check ${email} for account activation`,
        statusCode: HttpStatus.OK,
      };
    } else {
      throw new HttpException(
        'Activation mail not sent, please login to continue! ',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async updateUser(data: IUserUpdate): Promise<ResponseStatus> {
    const userData = await this.userRepository.findOne({ _id: data.id });
    if (!userData) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const update = await this.userRepository.updateOne(
      { _id: data.id },
      { $set: data.payload },
      { new: true },
    );

    if (!update) {
      throw new HttpException(
        'Unable to upate your record, please try again',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const status: ResponseStatus = {
      message: 'User information updated',
      statusCode: HttpStatus.OK,
      data: update,
    };
    return status;
  }

  async delUser(id: string): Promise<ResponseStatus> {
    const deleted = await this.userRepository.deleteOne({ _id: id });

    if (deleted.acknowledged) {
      const status: ResponseStatus = {
        message: 'User deleted',
        statusCode: HttpStatus.OK,
      };
      return status;
    } else {
      throw new HttpException('Unable to delete user', HttpStatus.BAD_REQUEST);
    }
  }

  async activateAccount(token: string): Promise<ResponseStatus> {
    let status: ResponseStatus;

    const res = await this.userRepository.findOneAndUpdate(
      { accessToken: token },
      { $set: { isActive: true } },
      { new: true },
    );
    console.log(res);

    if (res) {
      status = {
        message: 'Account activated, proceed to login',
        statusCode: HttpStatus.OK,
      };

      return status;
    }

    status = {
      message: 'Invalid activation token passed',
      statusCode: HttpStatus.UNAUTHORIZED,
    };
    return status;
  }

  async forgotPassword(email: string): Promise<ResponseStatus> {
    let status: ResponseStatus;
    const data = await this.userRepository.findOne({ email: email });
    if (data) {
      const { firstName, lastName, email, accessToken } = data;
      const value: IMailInterface = {
        firstName,
        lastName,
        accessToken,
        email,
      };
      return await this.mailService.passwordResetMail(value);
    } else {
      throw new HttpException('Email not found!', HttpStatus.NOT_FOUND);
    }
  }

  async change(payload: IUserPasswordChange): Promise<ResponseStatus> {
    let status: ResponseStatus;

    const userObj = await this.userRepository.findOne({
      _id: payload.id,
    });

    if (userObj) {
      const valid = await compare(payload.oldPassword, userObj.password);
      if (!valid)
        throw new HttpException(
          'Old password is incorrect',
          HttpStatus.BAD_REQUEST,
        );

      const hashedPassword = await this.userUtils.hashData(payload.password);
      const saved = await this.userRepository.findByIdAndUpdate(
        { _id: payload.id },
        { password: hashedPassword },
      );
      if (!saved) {
        throw new HttpException(
          'Unable to update your password',
          HttpStatus.BAD_REQUEST,
        );
      }
      status = {
        message: 'Password update complete',
        statusCode: HttpStatus.OK,
      };
      return status;
    }
  }

  async resetPassword(payload: IPasswordInterface): Promise<ResponseStatus> {
    const { accessToken, password } = payload;
    const hashedPassword = await this.userUtils.hashData(password);

    const data = await this.userRepository.updateOne(
      { accessToken: accessToken },
      { password: hashedPassword },
      { new: true },
    );
    if (!data) {
      throw new HttpException(
        'Unable to reset your password, try gain!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const status: ResponseStatus = {
      message: 'Password reset is complete',
      statusCode: HttpStatus.OK,
    };
    return status;
  }

  async logout(userEmail: string): Promise<ResponseStatus> {
    const res = await this.userRepository.updateOne(
      {
        email: userEmail,
      },
      { $set: { accessToken: null, refreshToken: null } },
      { new: true },
    );
    if (res.acknowledged) {
      const status = {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
      return status;
    }
  }

  async refreshToken(userEmail: string): Promise<ResponseStatus> {
    const user = await this.userRepository.findOne({
      email: userEmail,
    });

    if (!user)
      throw new HttpException(
        'User not found, access denied',
        HttpStatus.UNAUTHORIZED,
      );
    const tokens = await this.userUtils.generateTokens(user.email);
    if (!tokens) {
      throw new HttpException(
        'Unable to refresh tokens',
        HttpStatus.BAD_REQUEST,
      );
    }

    const myHashedToken = await this.userUtils.hashAllTokens(
      tokens.accessToken,
      tokens.refreshToken,
    );

    const res = await this.userRepository.updateOne(
      { _id: user._id },
      { $set: myHashedToken },
      { new: true },
    );

    if (res.acknowledged) {
      const status: ResponseStatus = {
        message: 'tokens updated',
        statusCode: HttpStatus.OK,
        data: tokens,
      };
      return status;
    }
  }
}
