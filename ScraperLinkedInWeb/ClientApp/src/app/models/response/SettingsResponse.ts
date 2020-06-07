import { BaseResponse } from "./BaseResponse";
import { SettingsViewModel } from "../entities/SettingsViewModel";

export class SettingsResponse extends BaseResponse {
  SettingsViewModel: SettingsViewModel;
}
