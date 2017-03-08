import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Region } from './models/region.model';
import { DirectoryRepository } from './repositories/directory.repository';

@Component({
	moduleId: module.id,
	selector: 'app-region-list',
	templateUrl: 'region-list.component.html',
	providers: [DirectoryRepository]
})
export class RegionListComponent implements OnInit {

	items: Region[] = [];

	constructor(
		private _repo: DirectoryRepository,
		private _router: Router
	) { }

	ngOnInit() {
		this.findRegions();
	}

	findRegions() {
		this._repo.findAll(Region)
			.then(res => this.items = res);
	}

	gotoEdit(id: string = ''): void {
		this._router.navigate(['/region/edit', id]);
	}
}
