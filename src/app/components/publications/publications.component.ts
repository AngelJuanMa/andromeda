import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { LikeService } from '../../services/like.service';
import { Like } from '../../models/like';


@Component({
	selector: 'publications',
	templateUrl: './publications.component.html',
	providers: [UserService, PublicationService, LikeService]
})
export class PublicationsComponent implements OnInit{
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
	@Input() user: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _publicationService: PublicationService,
		private _likeService: LikeService
	){
		this.title = 'Publicaciones';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.page = 1;
	}

	ngOnInit(){
		window.addEventListener('scroll',() => {

	const scrollable = document.documentElement.scrollHeight - window.innerHeight;

	const scrolled = window.scrollY;

	if (Math.ceil(scrolled) === scrollable) {
		this.viewMore();

	  }
});
		this.getPublications(this.user, this.page);
		
	}

	getPublications(user, page, adding = false){
		this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
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
						/*$("html, body").animate({ scrollTop: $('html').prop("scrollHeight")}, 500);*/

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

		this.getPublications(this.user, this.page, true);
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

