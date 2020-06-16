import { SortedCompaniesFieldTypes } from "../Types/SortedCompaniesFieldTypes";
import { ExecutionStatus } from "../Types/ExecutionStatus";

export class SearchCompaniesRequest {
  SearchValue: string;
  SortedFieldType: SortedCompaniesFieldTypes;
  IsAscending: boolean;
  StartDate: Date;
  EndDate: Date;
  PageNumber: number;
  PageSize: number;
  ExecutionStatus: ExecutionStatus;
}
