import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { Entry } from './models/entry.model';

import { DirectoryService } from './services/directory.service';

@Component({
	moduleId: module.id,
	selector: 'app-entry-list',
	templateUrl: 'entry-list.component.html'
})
export class EntryListComponent implements OnInit {
	entryKey = '';
	meta = DirectoryService.metaEntryEmpty;
	items: Entry[] = [];

	constructor(
		private _dirSrv: DirectoryService,
		private _router: Router,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this._route.params
			.subscribe(params => {
				this.entryKey = params['entry'];
				this.meta = this._dirSrv.getMeta(this.entryKey);
				this.findItems();
			});
	}

	findItems() {
		this._dirSrv.datas
			.subscribe(datas => this.items = datas[this.entryKey]);
	}

	gotoEdit(id: string = ''): void {
		this._router.navigate(['directory/' + this.entryKey, id]);
		return;
	}
}
