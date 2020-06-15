import { ExecutionStatus } from "../Types/ExecutionStatus";

export class CompanyViewModel {
  Id: number;
  OrganizationName: string;
  OrganizationURL: string;
  Founders: string;
  HeadquartersLocation: string;
  Website: string;
  LinkedInURL: string;
  LogoUrl: string; //
  Specialties: string;
  ExecutionStatus: ExecutionStatus;
  Facebook: string;
  Twitter: string;
  PhoneNumber: string;
  AmountEmployees: string;
  Industry: string; //
  AccountId: number;
  LastScrapedPage: number;
  DateCreated: Date;
}
