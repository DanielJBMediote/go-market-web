import { IBaseObjectApi } from "./Api";
import { IUserApi } from "./UserApi";

export interface ICommentApi extends IBaseObjectApi {
  user: IUserApi;
  comment: string;
}
