import { BaseResponse } from "./BaseResponse";
import { SearchCompaniesViewModel } from "../entities/SearchCompaniesViewModel";

export class SearchCompaniesResponse extends BaseResponse {
  SearchCompaniesViewModel: SearchCompaniesViewModel[];
  TotalCount: number;
}
