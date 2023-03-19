import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  userMockedDto,
  updateMock,
  loginMock,
  responseMock,
} from './utils/mockData';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    createUser: jest.fn().mockImplementation((userMockedDto) => {
      return { id: 'expected id', ...userMockedDto };
    }),

    getSingleUser: jest.fn().mockImplementation((token) => {
      return { id: 'expected id', ...userMockedDto };
    }),

    getUsers: jest.fn().mockImplementation(() => {
      return [{ id: 'expected id', ...userMockedDto }];
    }),
    updateUser: jest.fn().mockImplementation((updateMock) => {
      return { id: 'expected id', ...userMockedDto };
    }),
    loginUser: jest.fn().mockImplementation((loginMock) => {
      return { id: 'expected id', ...userMockedDto };
    }),
    getProfile: jest.fn().mockImplementation(() => {
      return { id: 'expected id', ...userMockedDto };
    }),
    delUser: jest.fn().mockImplementation(() => {
      return responseMock;
    }),
    logout: jest.fn().mockImplementation(() => {
      return responseMock;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user record', () => {
    expect(controller.create(userMockedDto)).toEqual({
      id: expect.any(String),
      ...userMockedDto,
    });
  });

  it('should get user by id', () => {
    expect(controller.getUserById('token')).toEqual({
      id: expect.any(String),
      ...userMockedDto,
    });
  });

  it('should get an array of users', () => {
    expect(controller.getAllUsers()).toEqual([
      {
        id: expect.any(String),
        ...userMockedDto,
      },
    ]);
  });

  it('should update user record', () => {
    expect(controller.updateUser(updateMock)).toEqual({
      id: expect.any(String),
      ...userMockedDto,
    });
  });

  it('should log the user in', () => {
    expect(controller.loginUser(loginMock)).toEqual({
      id: expect.any(String),
      ...userMockedDto,
    });
  });

  it('should retrieve user profile', () => {
    expect(controller.userProfile()).toEqual({
      id: expect.any(String),
      ...userMockedDto,
    });
  });

  it('should  logout user out', () => {
    expect(controller.logout('user email')).toEqual(responseMock);
  });

  it('should delete user', () => {
    expect(controller.deleteUser('userId')).toEqual(responseMock);
  });
});
