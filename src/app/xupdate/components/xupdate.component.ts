import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-xupdate',
	templateUrl: './xupdate.component.html'
})
export class XupdateComponent implements OnInit {

	constructor(
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		// this._route.data
	}

}
