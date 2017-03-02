import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Region } from './models/region.model';
import { Country } from './models/country.model';

import { RegionRepository } from './repositories/region.repository';
import { CountryRepository } from './repositories/country.repository';

@Component({
	moduleId: module.id,
	selector: 'app-region-edit',
	templateUrl: 'region-edit.component.html',
	providers: [
		RegionRepository,
		CountryRepository
	]
})
export class RegionEditComponent implements OnInit {
	region = { id: '', name: '', countries: [] };
	countries: Country[] = [];

	constructor(
		private _regionRepo: RegionRepository,
		private _countrynRepo: CountryRepository,
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
				const res = this._regionRepo.getById(params['id']);
				return res;
			})
			.subscribe(region => {
				let cnts = [];
				if (region != null) {
					this.region.id = region._id;
					this.region.name = region.name;
					// this.region.countries = region.countries;
					cnts = region.countries;
				}
				this._countrynRepo.findAll()
					.then(countries => {
						this.countries = countries
							.filter(c => cnts.every(cr => cr !== c._id));
						this.region.countries = cnts.map(code => {
							const v = countries.find(c => c._id === code);
							return v ? v : new Country(code, '<undefined>');
						});
						console.log(this.region.countries);
					});
			});
	}

	save(): void {
		const country = new Region(
			this.region.id,
			this.region.name,
			this.region.countries
				.map(c => c._id)
		);
		this._regionRepo.store(country);
		this.gotoBack();
	}

	gotoBack(): void {
		this._location.back();
	}

	include(code: string): void {
		const index = this.countries.findIndex(c => c._id === code);
		if (index > -1) {
			const country = this.countries[index];
			this.countries.splice(index, 1);
			this.region.countries.push(country);
			this.region.countries.sort((c1, c2) => c1.name > c2.name ? 1 : (c1.name < c2.name ? -1 : 0));
		}
	}

	exclude(code: string): void {
		const index = this.region.countries.findIndex(c => c._id === code);
		if (index > -1) {
			const country = this.region.countries[index];
			this.region.countries.splice(index, 1);
			this.countries.push(country);
			this.countries.sort((c1, c2) => c1.name > c2.name ? 1 : (c1.name < c2.name ? -1 : 0));
		}
	}
}
