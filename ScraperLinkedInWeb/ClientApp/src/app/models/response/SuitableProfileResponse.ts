import { BaseResponse } from "./BaseResponse";
import { SuitableProfileViewModel } from "../entities/SuitableProfileViewModel";

export class SuitableProfileResponse extends BaseResponse {
  SuitableProfileViewModel: SuitableProfileViewModel;
}
