import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
	selector: 'app-back-forward',
	templateUrl: './back-forward.component.html'
})
export class BackForwardComponent implements OnInit {

	constructor(
		private _location: Location
	) { }

	ngOnInit() {
	}

	onBack() {
		this._location.back();
	}
	onForward() {
		this._location.forward();
	}
}
