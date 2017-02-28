import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Region } from './models/region.model';

import { RegionRepository } from './repositories/region.repository';

@Component({
	moduleId: module.id,
	selector: 'app-region-edit',
	templateUrl: 'region-edit.component.html',
	providers: [RegionRepository]
})
export class RegionEditComponent implements OnInit {
	region = {id: '', name: '', countries: []};

	constructor(
		private _repo: RegionRepository,
		private _route: ActivatedRoute,
		private _location: Location
	) { }

	ngOnInit() {
		this._route.params
			.switchMap((params: Params) => {
				let id = params['id'];
				if (!id) {
					return null;
				}
				let res = this._repo.getById(params['id']);
				return res;
			})
			.subscribe(region => {
				if (region != null) {
					this.region.id = region._id;
					this.region.name = region.name;
					this.region.countries = region.countries;
				}
			});
	}

	save(): void {
		const country = new Region(this.region.id, this.region.name, this.region.countries);
		this._repo.store(country);
		this.gotoBack();
	}

	gotoBack(): void {
		this._location.back();
	}
}
