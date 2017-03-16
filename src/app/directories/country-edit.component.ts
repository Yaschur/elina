import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Country } from './models/country.model';

import { DirectoryRepository } from './repositories/directory.repository';

@Component({
	moduleId: module.id,
	selector: 'app-country-edit',
	templateUrl: 'country-edit.component.html'
})
export class CountryEditComponent implements OnInit {
	country = { code: '', name: '' };

	constructor(
		private _repo: DirectoryRepository,
		private _route: ActivatedRoute,
		private _location: Location
	) { }

	ngOnInit() {
		this._route.params
			.switchMap((params: Params) => {
				const id = params['id'];
				if (!id) {
					return null;
				}
				const res = this._repo.getById(Country, params['id']);
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

	submit(save: boolean) {
		if (save) {
			this.save();
		}
		this._location.back();
	}

	private save(): void {
		const country = new Country({ _id: this.country.code, name: this.country.name });
		this._repo.store(country);
	}
}
