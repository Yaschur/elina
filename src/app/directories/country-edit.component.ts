import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Country } from './models/country.model';

import { CountryRepository } from './repositories/country.repository';

@Component({
	moduleId: module.id,
	selector: 'app-country-edit',
	templateUrl: 'country-edit.component.html',
	providers: [CountryRepository]
})
export class CountryEditComponent implements OnInit {
	country = {code: '', name: ''};

	constructor(
		private _repo: CountryRepository,
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
			.subscribe(country => {
				if (country != null) {
					console.log(country);
					this.country.code = country._id;
					this.country.name = country.name;
				}
			});
	}

	save(): void {
		const country = new Country(this.country.code, this.country.name);
		this._repo.store(country);
		this.gotoBack();
	}

	gotoBack(): void {
		this._location.back();
	}
}
