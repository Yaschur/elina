import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-xupdate',
	templateUrl: './xupdate.component.html'
})
export class XupdateComponent implements OnInit {

	data: string[][];

	constructor(
		private _route: ActivatedRoute
	) {
		this.data = [];
	}

	ngOnInit() {
		this._route.params
			.subscribe(params => this.data = JSON.parse(params['data']));
	}

}
