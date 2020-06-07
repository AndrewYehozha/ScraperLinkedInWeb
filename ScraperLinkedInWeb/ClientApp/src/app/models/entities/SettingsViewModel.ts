import { ScraperStatus } from "../Types/ScraperStatus";

export class SettingsViewModel {
  Id: number;
  Token: string;
  Password: string;
  Login: string;
  TechnologiesSearch: string;
  RolesSearch: string;
  ScraperStatus: ScraperStatus;
  IsSearchChiefs: boolean;
  IsSearchDevelopers: boolean;
  AccountId: number;
}
