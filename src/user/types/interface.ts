export interface IUserCreationDto {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  isDeleted?: boolean;
  isActive?: boolean;
  accessToken?: string;
  refreshToken?: string;
  createdAt?: Date;
  updateAt?: Date;
}

export interface ResponseStatus {
  statusCode: number;
  message: string;
  data?: any;
}



export interface IUserAddress {
  country?: string;
  state?: string;
  lga?: string;
  description?: string;
}

export interface IUserLoginDto {
  email: string;
  password: string;

}
export interface IUserPasswordChange {
  id: string;
  oldPassword: string;
  password: string;
  email?: string;
}

export interface IUserUpdate {
  id: string;
  payload: Partial<IUserCreationDto>;
}

export interface JwtPayload {
  email: string;
}

export interface IMailInterface {
  firstName: string;
  lastName: string;
  email: string;
  accessToken?: string;
}

export interface IPasswordInterface {
  password: string;
  accessToken?: string;
}
