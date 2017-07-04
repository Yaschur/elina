import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DirEntries } from '../models/dir-entries.model';

import { DirectoryService } from '../services/directory.service';

@Component({
	selector: 'app-region-list',
	templateUrl: 'region-list.component.html'
})
export class RegionListComponent implements OnInit {

	dirEntries: DirEntries = DirectoryService.dirEntriesEmpty;

	constructor(
		private _dirSrv: DirectoryService,
		private _router: Router
	) { }

	ngOnInit() {
		this.dirEntries = this._dirSrv.getDir('region');
	}

	gotoEdit(id: string = ''): void {
		this._router.navigate(['directory/region', id]);
	}
}
