import { AccountViewModel } from "../entities/AccountViewModel";
import { BaseResponse } from "./BaseResponse";

export class AccountResponse extends BaseResponse {
  AccountViewModel: AccountViewModel;
}
