import { ProfileStatus } from "../Types/ProfileStatus";
import { SortedSuitablesProfilesFieldTypes } from "../Types/SortedSuitablesProfilesFieldTypes";

export class SearchSuitableProfilesRequest {
  SearchValue: string;
  SortedFieldType: SortedSuitablesProfilesFieldTypes;
  IsAscending: boolean;
  StartDate: Date;
  EndDate: Date;
  CompanyId: number;
  PageNumber: number;
  PageSize: number;
  ProfileStatus: ProfileStatus;
}
