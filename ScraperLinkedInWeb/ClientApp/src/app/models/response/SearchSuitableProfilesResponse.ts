import { BaseResponse } from "./BaseResponse";
import { SearchSuitableProfilesViewModel } from "../entities/SearchSuitableProfilesViewModel";

export class SearchSuitableProfilesResponse extends BaseResponse {
  SearchSuitableProfilesViewModel: SearchSuitableProfilesViewModel[];
  TotalCount: number;
}
