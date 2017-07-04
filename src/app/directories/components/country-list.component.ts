import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DirEntries } from '../models/dir-entries.model';

import { DirectoryService } from '../services/directory.service';

@Component({
	selector: 'app-country-list',
	templateUrl: 'country-list.component.html'
})
export class CountryListComponent implements OnInit {

	dirEntries: DirEntries = DirectoryService.dirEntriesEmpty;

	constructor(
		private _dirSrv: DirectoryService,
		private _router: Router
	) { }

	ngOnInit() {
		this.dirEntries = this._dirSrv.getDir('country');
	}

	gotoEdit(id: string = ''): void {
		this._router.navigate(['directory/country', id]);
	}
}
