import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Country } from './models/country.model';

import { DirEntries } from './models/dir-entries.model';
import { DirectoryService } from './services/directory.service';

@Component({
	selector: 'app-country-edit',
	templateUrl: 'country-edit.component.html'
})
export class CountryEditComponent implements OnInit {
	private _origId = '';
	dirEntries: DirEntries = DirectoryService.dirEntriesEmpty;
	code = '';
	name = '';

	constructor(
		private _dirSrv: DirectoryService,
		private _route: ActivatedRoute,
		private _location: Location
	) { }

	ngOnInit() {
		this._route.params
			.subscribe(params => {
				this.code = params['id'];
				this._origId = params['id'];
				this.dirEntries = this._dirSrv.getDir('country');
			});
		this.dirEntries.data
			.subscribe(items => {
				const ind = items.findIndex(e => e._id === this.code);
				if (ind >= 0) {
					this.name = items[ind].name;
				} else {
					this.code = this._origId = '';
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
		const country = new Country({ _id: this.code, name: this.name });
		if (this._origId && this._origId !== this.code) {
			this._dirSrv.removeEntry('country', new Country({ _id: this._origId }));
		}
		this._dirSrv.storeEntry('country', country);
	}
}
