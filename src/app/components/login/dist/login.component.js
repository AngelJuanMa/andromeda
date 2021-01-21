"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var user_1 = require("../../models/user");
var user_service_1 = require("../../services/user.service");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(_route, _router, _userService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this.title = 'Identificate';
        this.user = new user_1.User("", "", "", "", "", "", "", "ROLE_USER");
    }
    LoginComponent.prototype.ngOnInit = function () {
        this._router.navigate(['/publicaciones']);
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        // loguear al usuario y conseguir sus datos
        this._userService.signup(this.user).subscribe(function (response) {
            _this.identity = response.user;
            if (!_this.identity || !_this.identity._id) {
                _this.status = 'error';
            }
            else {
                // PERSISTIR DATOS DEL USUARIO
                localStorage.setItem('identity', JSON.stringify(_this.identity));
                // Conseguir el token
                _this.getToken();
            }
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status = 'error';
            }
        });
    };
    LoginComponent.prototype.getToken = function () {
        var _this = this;
        this._userService.signup(this.user, 'true').subscribe(function (response) {
            _this.token = response.token;
            if (_this.token.length <= 0) {
                _this.status = 'error';
            }
            else {
                // PERSISTIR TOKEN DEL USUARIO
                localStorage.setItem('token', _this.token);
                // Conseguir los contadores o estadisticas del usuario
                _this.getCounters();
            }
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status = 'error';
            }
        });
    };
    LoginComponent.prototype.getCounters = function () {
        var _this = this;
        this._userService.getCounters().subscribe(function (response) {
            localStorage.setItem('stats', JSON.stringify(response));
            _this.status = 'success';
            _this._router.navigate(['/publicaciones']);
        }, function (error) {
            console.log(error);
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: './login.component.html',
            providers: [user_service_1.UserService]
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
