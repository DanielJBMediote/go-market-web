import { AxiosResponse } from "axios";

export interface IBaseObjectApi {
  id: number,
  createdAt: Date
  updatedAt: Date
}

export abstract class BaseApi<Body> {
  abstract create(body: Body): Promise<AxiosResponse>;
  abstract fetchAll(): Promise<AxiosResponse>;
  abstract fetchOneById(id: number): Promise<AxiosResponse>;
  abstract update(id: number, body: Body): Promise<AxiosResponse>;
  abstract delete(id: number): Promise<AxiosResponse>;
}
