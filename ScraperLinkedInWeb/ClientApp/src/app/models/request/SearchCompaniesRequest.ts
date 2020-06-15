import { SortedCompaniesFieldTypes } from "../Types/SortedFieldTypes";
import { ExecutionStatus } from "../Types/ExecutionStatus";

export class SearchCompaniesRequest {
  SearchValue: string;
  SortedFieldTypes: SortedCompaniesFieldTypes;
  IsAscending: boolean;
  StartDate: Date; //ToDo
  EndDate: Date; //ToDo
  PageNumber: number;
  PageSize: number;
  ExecutionStatus: ExecutionStatus;
}
