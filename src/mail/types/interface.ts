export interface ResponseStatus {
  statusCode: number;
  message: string;
  data?: any;
}

export interface IMailInterface {
  firstName: string;
  lastName: string;
  email: string;
  accessToken?: string;
}
