"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var authorize_service_1 = require("../authorization/authorize.service");
var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(http, authorizeService) {
        this.http = http;
        this.authorizeService = authorizeService;
        this.httpOptions = {
            headers: new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.authorizeService.getToken() + "." })
        };
        this.getSettings();
    }
    SettingsComponent.prototype.getSettings = function () {
        var _this = this;
        try {
            this.http.get(environment_1.environment.baseServerUrl + '/api/v1/settings/setting', this.httpOptions)
                .toPromise()
                .then(function (response) {
                console.log("settings");
                console.log(response);
                switch (response.StatusCode) {
                    case authorize_service_1.AuthenticationResultStatus.Success:
                        _this.model = response.SettingsViewModel;
                        break;
                    case authorize_service_1.AuthenticationResultStatus.Unauthorized:
                    case authorize_service_1.AuthenticationResultStatus.Fail:
                        _this.errorMessage = response.ErrorMessage;
                        break;
                    default:
                        _this.errorMessage = "Invalid result status";
                        break;
                }
            }, function (error) {
                _this.errorMessage = error;
            })
                .catch(function (error) {
                _this.errorMessage = "Server is not available";
            });
        }
        catch (silentError) {
            this.errorMessage = silentError;
        }
    };
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings-component.js.map