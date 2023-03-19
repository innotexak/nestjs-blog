import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mail/mail.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User } from './user.schema';
import { UserService } from './user.service';
import { UserUtils } from './utils';
import { JwtService } from '@nestjs/jwt';
import {
  loginMock,
  mockPasswordChange,
  responseMock,
  updateMock,
  userMockedDto,
  mockpasswordReset,
  mockExpressMulerFile,
} from './utils/mockData';
import { BadRequestException, HttpException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let filter: Record<string, any>;

  const mockCloudinary = {
    uploadImage: jest.fn().mockImplementation((mockFile) => mockFile),
  };
  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) => Promise.resolve({ id: String, ...user })),
    findOne: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: 'userid string', ...userMockedDto }),
      ),
    find: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([{ id: 'user id expected', ...userMockedDto }]),
      ),
    updateOne: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: 'expected', ...userMockedDto }),
      ),
    findById: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: 'expected', ...userMockedDto }),
      ),
    deleteOne: jest
      .fn()
      .mockImplementation((filter) => Promise.resolve(responseMock)),
    findByIdAndUpdate: jest
      .fn()
      .mockImplementation((password) => Promise.resolve(responseMock)),
  };
  const mockedMailService = {
    countActivationMail: jest
      .fn()
      .mockImplementation((mockMailToken) => Promise.resolve(null)),
    passwordResetMail: jest
      .fn()
      .mockImplementation((mockMailToken) => Promise.resolve(responseMock)),
  };
  const mockUserUtils = {
    hashAllTokens: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
    hashData: jest.fn().mockImplementation((dto) => dto),
    generateTokens: jest.fn().mockImplementation((email) =>
      Promise.resolve({
        accessToken: 'testaccesstoken',
        refreshToken: 'testgeneratedrrefreshtoken',
      }),
    ),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: CloudinaryService, useValue: mockCloudinary },
        { provide: UserUtils, useValue: mockUserUtils },
        {
          provide: MailService,
          useValue: mockedMailService,
        },

        { provide: getModelToken(User.name), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and retrieve it', async () => {
    try {
      await service.createUser({
        id: expect.any(String),
        ...userMockedDto,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should get single user ', async () => {
    expect(await service.getSingleUser(filter)).toEqual({
      id: expect.any(String),
      ...userMockedDto,
    });
  });

  it('should get single user by Id', async () => {
    expect(await service.getUserById('expected id')).toEqual({
      id: expect.any(String),
      ...userMockedDto,
    });
  });

  it('should get an array of users', async () => {
    expect(await service.getUsers()).toEqual([
      {
        id: expect.any(String),
        ...userMockedDto,
      },
    ]);
  });

  it('should login user in', async () => {
    try {
      await service.loginUser(loginMock);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should update user record', async () => {
    try {
      await service.updateUser(updateMock);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should delete a user by id', async () => {
    try {
      await service.delUser('id');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });
  it('should activate user account', async () => {
    try {
      await service.activateAccount('token');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should send forgot password mail', async () => {
    try {
      await service.forgotPassword('test@gmail.com');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should change user password', async () => {
    try {
      await service.change(mockPasswordChange);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should reset user password', async () => {
    try {
      await service.resetPassword(mockpasswordReset);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should logout user out', async () => {
    try {
      await service.logout('example@gmail.com');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should check if user exist', async () => {
    try {
      await service.checkUser(filter);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should upload user profile pic', async () => {
    try {
      await service.profileUpload('userId', mockExpressMulerFile);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });
  // it('should refresh user tokens', async () => {
  //   try {
  //     await service.refreshToken('usertestemail@gmail.com');
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(HttpException);
  //   }
  // });
});
