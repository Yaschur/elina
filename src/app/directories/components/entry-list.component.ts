import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { DirEntries } from '../models/dir-entries.model';

import { DirectoryService } from '../services/directory.service';

@Component({
	selector: 'app-entry-list',
	templateUrl: 'entry-list.component.html'
})
export class EntryListComponent implements OnInit {
	entryKey = '';
	dirEntries: DirEntries = DirectoryService.dirEntriesEmpty;

	constructor(
		private _dirSrv: DirectoryService,
		private _router: Router,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this._route.params
			.subscribe(params => {
				this.entryKey = params['entry'];
				this.dirEntries = this._dirSrv.getDir(this.entryKey);
			});
	}

	// findItems() {
	// 	this._dirSrv.datas
	// 		.subscribe(datas => this.items = datas[this.entryKey]);
	// }

	gotoEdit(id: string = ''): void {
		this._router.navigate(['directory/' + this.entryKey, id]);
		return;
	}
}
