import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Country } from './models/Country.model';
import { CountryRepository } from './repositories/country.repository';

@Component({
	moduleId: module.id,
	selector: 'app-country-list',
	templateUrl: 'country-list.component.html',
	providers: [CountryRepository]
})
export class CountryListComponent implements OnInit {

	items: Country[] = [];

	constructor(
		private _repo: CountryRepository,
		private _router: Router
	) { }

	ngOnInit() {
		this.findCountries();
	}

	findCountries() {
		this._repo.findAll()
			.then(res => this.items = res);
	}

	gotoEdit(id: string = ''): void {
		this._router.navigate(['/country/edit', id]);
	}
}
