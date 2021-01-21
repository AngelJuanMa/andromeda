import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { LikeService } from '../../services/like.service';
import { Like } from '../../models/like';

@Component({
	selector: 'timeline',
	//templateUrl: './timeline.component.html',
	templateUrl: '../publications/publications.component.html',
	providers: [UserService, PublicationService, LikeService]
})
export class TimelineComponent implements OnInit{
	public title: string;
	public identity;
	public token;
	public url: string;
	public status: string;
	public page;
	public total;
	public pages;
	public itemsPerPage;
	public publications: Publication[];
	public showImage;
	public seeImage: boolean;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _publicationService: PublicationService,
		private _likeService: LikeService
	){
		this.title = 'publicaciones';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.page = 1;
		this.seeImage = true;
	}

	ngOnInit(){
		window.addEventListener('scroll',() => {

	const scrollable = document.documentElement.scrollHeight - window.innerHeight;

	const scrolled = window.scrollY;

	if (Math.ceil(scrolled) === scrollable) {
		this.viewMore();

	  }
});

		this.getPublications(this.page);
	}

	getPublications(page, adding = false){
		this._publicationService.getPublications(this.token, page).subscribe(
			response => {
				if(response.publications){
					this.total = response.total_items;
					this.pages = response.pages;
					this.itemsPerPage = response.items_per_page;

					if(!adding){
						this.publications = response.publications;
					}else{
						var arrayA = this.publications;
						var arrayB = response.publications;
						this.publications = arrayA.concat(arrayB);

						/*$("html, body").animate({ scrollTop: $('body').prop("scrollHeight")}, 500);*/
					}

					if(page > this.pages){
						//this._router.navigate(['/home']);
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

	public noMore = false;
	viewMore(){
		this.page += 1;

		if(this.page == this.pages){
			this.noMore = true;
		}

		this.getPublications(this.page, true);
	}
	refresh(event = null){
		this.getPublications(1);
	}


	deletePublication(id){
		this._publicationService.deletePublication(this.token, id).subscribe(
			response => {
				this.refresh();
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	likePublication(liked, publication){
		var like = new Like('',this.identity._id, liked, publication);
		this._likeService.addLike(this.token, like).subscribe(
			response => {
				if(!response.like){
					this.status = 'error';

				}else{
					this.status = 'success';
					//his.follows.push(liked);
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

	unlikePublication(liked){
		this._likeService.deleteLike(this.token, liked).subscribe(
			response =>{
				/*
				var search = this.follows.indexOf(followed);
				if(search != -1){
					this.follows.splice(search, 1);
				}
				*/
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

}
