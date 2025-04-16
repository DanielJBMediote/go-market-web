import { CustomResponse } from ".";

export interface IBaseObjectApi {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// type ResponseData<T> = AxiosResponse<CustomResponse<T>>;

export abstract class BaseApi<Body, T> {
  abstract create(body: Body): Promise<CustomResponse<T>>;
  abstract fetchAll(): Promise<CustomResponse<T[]>>;
  abstract fetchOneById(id: number): Promise<CustomResponse<T>>;
  abstract update(id: number, body: Body): Promise<CustomResponse<T>>;
  abstract delete(id: number): Promise<CustomResponse<null>>;
}
