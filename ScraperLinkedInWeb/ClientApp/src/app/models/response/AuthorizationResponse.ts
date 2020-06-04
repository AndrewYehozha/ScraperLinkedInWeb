import { BaseResponse } from "./BaseResponse";
import { AccountViewModel } from "../entities/AccountViewModel";

export class AuthorizationResponse extends BaseResponse {
  Account: AccountViewModel;
  Token: string;
  TokenExpires: Date;
}
