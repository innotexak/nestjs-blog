export interface IBlogCreationDto {
  id?: string;
  title: string;
  content: string;
  user: string;
  createdAt?: Date;
  updateAt?: Date;
}

export interface ResponseStatus {
  statusCode: number;
  message: string;
  data?: any;
}

export interface IUpdatePostDto {
  id: string;
  payload: Partial<IBlogCreationDto>;
}
