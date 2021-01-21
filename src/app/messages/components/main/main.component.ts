import { Component, DoCheck } from '@angular/core';

@Component({
	selector: 'main',
	templateUrl: './main.component.html'
})
export class MainComponent {
	public title: string;

	constructor(){
		this.title = 'Mesajes privados';
	}


}