import {Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {UserService} from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import {GLOBAL} from '../../services/global';
import {Publication} from '../../models/publication';
import {PublicationService} from '../../services/publication.service';
import {UploadService} from '../../services/upload.service';

@Component({
	selector: 'sidebar',
	templateUrl: './sidebar.component.html',
	providers: [UserService,  FollowService ,PublicationService, UploadService]
})
export class SidebarComponent implements OnInit{
	public identity;
	public token;
	public stats;
	public url;
	public status;
	public publication: Publication;
	public followed;
	public following;

	constructor(
		private _userService: UserService,
		private _followService: FollowService,
		private _publicationService: PublicationService,
		private _uploadService: UploadService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.stats = this._userService.getStats();
		this.url = GLOBAL.url;
		this.publication = new Publication("","","","",this.identity._id);
		this.followed = false;
		this.following = false;
	}



	onSubmit(form, $event){
		this._publicationService.addPublication(this.token, this.publication).subscribe(
			response => {
				if(response.publication){
					this.publication = response.publication;
					
					if(this.filesToUpload && this.filesToUpload.length){
					//Subir imagen
					this._uploadService.makeFileRequest(this.url+'upload-image-pub/'+response.publication._id, [], this.filesToUpload, this.token, 'image')
					                   .then((result:any) => {
					                   		this.status = 'success';
					                   		this.publication.file = result.image;
											form.reset();
											this._router.navigate(['/publicaciones']);
											this.sended.emit({send:'true'});
					                   	});
					}else{
					  this.status = 'error';
					}

				}else{
					this.status = 'error';
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);
				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	// Output
	@Output() sended = new EventEmitter();
	sendPublication(event){
		this.sended.emit({send:'true'});
	}


	ngOnInit(){
		this.loadPage();
	}

	loadPage(){
		this._route.params.subscribe(params => {
			let id = params['id'];
			this.getCounters(id);
		});
	}

	
	getCounters(id){
		this._userService.getCounters(id).subscribe(
			response => {
				this.stats = response;
			},
			error => {
				console.log(<any>error);
			}
		);
	}


}