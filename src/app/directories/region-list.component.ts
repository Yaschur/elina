import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Region } from './models/region.model';

import { RegionRepository } from './repositories/region.repository';

@Component({
	moduleId: module.id,
	selector: 'app-region-list',
	templateUrl: 'region-list.component.html',
	providers: [RegionRepository]
})
export class RegionListComponent implements OnInit {

	items: Region[] = [];

	constructor(
		private _repo: RegionRepository,
		private _router: Router
	) { }

	ngOnInit() {
		this.findRegions();
	}

	findRegions() {
		this._repo.findAll()
			.then(res => this.items = res);
	}

	gotoEdit(id: string = ''): void {
		this._router.navigate(['/region/edit', id]);
	}
}
