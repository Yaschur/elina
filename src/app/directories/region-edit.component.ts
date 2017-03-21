import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { MetaEntry } from './models/meta-entry.model';
import { DirEntries } from './models/dir-entries.model';
import { Region } from './models/region.model';
import { Country } from './models/country.model';

import { DirectoryService } from './services/directory.service';

@Component({
	moduleId: module.id,
	selector: 'app-region-edit',
	templateUrl: 'region-edit.component.html'
})
export class RegionEditComponent implements OnInit {
	meta: MetaEntry;

	id = '';
	name = '';
	countries: Country[] = [];

	dirCountries: Country[] = [];


	constructor(
		private _dirSrv: DirectoryService,
		private _route: ActivatedRoute,
		private _location: Location
	) { }

	ngOnInit() {
		const dirEntry = this._dirSrv.getDir('region');
		this.meta = dirEntry.meta;

		this._route.params
			.subscribe(params => {
				this.id = params['id'];
			});

		this._dirSrv.getDir('country').data
			.subscribe(cnts => {
				this.dirCountries = Array.from(cnts);
			});

		dirEntry.data
			.subscribe(items => {
				const ind = items.findIndex(e => e._id === this.id);
				if (ind >= 0) {
					this.name = items[ind].name;
					this.countries = (<Region>items[ind]).countries
						.map(cid => {
							const country = this.dirCountries.find(c => c._id === cid);
							return country ? country : new Country({ _id: cid, name: '<!undefined!>' });
						});
					this.dirCountries = this.dirCountries
						.filter(c => !this.countries.map(c1 => c1._id).includes(c._id));
				} else {
					this.id = '';
					this.name = '';
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
		const region = new Region({
			_id: this.id,
			name: this.name,
			countries: this.countries.map(c => c._id)
		});
		this._dirSrv.storeEntry('region', region);
	}

	include(code: string): void {
		const index = this.dirCountries.findIndex(c => c._id === code);
		if (index > -1) {
			const country = this.dirCountries[index];
			this.dirCountries.splice(index, 1);
			this.countries.push(country);
			this.countries.sort((a, b) => a.name.localeCompare(b.name));
		}
	}

	exclude(code: string): void {
		const index = this.countries.findIndex(c => c._id === code);
		if (index > -1) {
			const country = this.countries[index];
			this.countries.splice(index, 1);
			if (country.name === '<!undefined!>') {
				return;
			}
			this.dirCountries.push(country);
			this.dirCountries.sort((a, b) => a.name.localeCompare(b.name));
		}
	}
}
