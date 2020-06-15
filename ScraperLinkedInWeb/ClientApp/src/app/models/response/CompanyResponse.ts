import { BaseResponse } from "./BaseResponse";
import { CompanyViewModel } from "../entities/CompanyViewModel";

export class CompanyResponse extends BaseResponse {
  CompanyViewModel: CompanyViewModel;
}
