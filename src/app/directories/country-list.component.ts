import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Country } from './models/country.model';
import { DirectoryRepository } from './repositories/directory.repository';

@Component({
	moduleId: module.id,
	selector: 'app-country-list',
	templateUrl: 'country-list.component.html',
	providers: [DirectoryRepository]
})
export class CountryListComponent implements OnInit {

	items: Country[] = [];

	constructor(
		private _repo: DirectoryRepository,
		private _router: Router
	) { }

	ngOnInit() {
		this.findCountries();
	}

	findCountries() {
		this._repo.findAll(Country)
			.then(res => this.items = res);
	}

	gotoEdit(id: string = ''): void {
		this._router.navigate(['directory/country', id]);
	}
}
