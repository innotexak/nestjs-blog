import { HttpStatus } from '@nestjs/common';
import { Stream } from 'stream';

export const userMockedDto = {
  firstName: 'firsrtname',
  lastName: 'lastname',
  email: 'test@gmail.com',
  userName: 'username',
  phoneNumber: '0908938339',
  password: '1234556',
  accountType: 'individual',
  country: 'nigeria',
  state: 'kogi',
  city: 'oloamaboro',
  address: 'Ogugu center',
  role: 'user',
};

export const updateMock = {
  id: 'expected id',
  payload: {
    firstName: 'innocent',
    lastName: 'Akuh',
    phoneNumber: '807838383838',
  },
};

export const loginMock = {
  email: 'test@gmail.com',
  password: 'mytestpassword',
};

export const mockPasswordChange = {
  id: 'expected id',
  oldPassword: 'example123',
  password: 'example123',
  email: 'test2@gmail.com',
};
export const mockpasswordReset = {
  password: 'example123',
  accessToken: 'token object',
};

export const responseMock = {
  message: expect.any(String),
  statusCode: expect.any(HttpStatus),
  data: expect.objectContaining(userMockedDto),
};

const mockMailResponse = {
  message: 'string response',
  statusCode: expect.any(HttpStatus),
};

const mockMailToken = {
  accessToken: 'string accesstoken',
  firstName: 'my first name ',
  lastName: 'my last name ',
  email: 'test@gmail.com',
};

export const mockExpressMulerFile = {
  filename: 'myfile',
  originalname: 'example file',
  encoding: 'mgp',
  mimetype: 'jpeg',
  size: 300,
  stream: expect.any(Stream),
  destination: 'destination',
  fieldname: 'filed',
  path: 'http///',
  buffer: expect.any(Buffer),
};
