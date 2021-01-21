import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	providers: [UserService]
}) 
export class RegisterComponent{
	public title:string;
	public user: User;
	public status: string;
	public identity;
	public token;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	){
		this.title = 'Registrate';
		this.user = new User("",
		"",
		"",
		"",
		"",
		"",
		"ROLE_USER",
		false
		);
	}


	onSubmit(form){
		
		this._userService.register(this.user).subscribe(
			response => {
				if(response.user && response.user._id){
					//console.log(response.user);
					this.status = 'success';
					this.login();
				}else{
					this.status = 'error';
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}


	login(){
		// loguear al usuario y conseguir sus datos
		this._userService.signup(this.user).subscribe(
			response => {
				this.identity = response.user;
 

				if(!this.identity || !this.identity._id){
					this.status = 'error2';
				}else{
					// PERSISTIR DATOS DEL USUARIO
					localStorage.setItem('identity', JSON.stringify(this.identity));

					// Conseguir el token
					this.getToken();
				}
				
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error2';
				}
			}
		);
	}


	getToken(){
		this._userService.signup(this.user, 'true').subscribe(
			response => {
				this.token = response.token;
				

				if(this.token.length <= 0){
					this.status = 'error2';
				}else{
					
					// PERSISTIR TOKEN DEL USUARIO
					localStorage.setItem('token',this.token);

					// Conseguir los contadores o estadisticas del usuario
					this.getCounters();
				}
				
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error2';
				}
			}
		);
	}

	getCounters(){
		this._userService.getCounters().subscribe(
			response => {
				localStorage.setItem('stats', JSON.stringify(response));
				this.status = 'success';
				this._router.navigate(['/publicaciones']);
			},
			error => {
				console.log(<any>error);
			}
		)

	}


}