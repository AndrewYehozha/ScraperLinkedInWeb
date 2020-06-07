import { ExecutionStatus } from "../Types/ExecutionStatus";

export class SearchCompaniesViewModel {
  Id: number;
  OrganizationName: string;
  HeadquartersLocation: string;
  Website: string;
  Specialties: string;
  ExecutionStatus: ExecutionStatus;
  AmountEmployees: string;
  DateCreated: string;
}
