import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DirectoryService, Country } from '../../directories';
import { CompanyRepository, Company } from '../../companies/core';
import { Subject } from 'rxjs/Subject';

@Component({
	selector: 'app-xupdate',
	templateUrl: './xupdate.component.html'
})
export class XupdateComponent implements OnInit {

	private _data: string[][];

	// countryNames: string[];
	private _nextIndex: number;
	private _currentItem: ImportedItem;
	private _countries: Country[];

	private _item = new Subject<ImportedItem>();

	item = this._item.asObservable();

	constructor(
		private _route: ActivatedRoute,
		private _dirSrv: DirectoryService,
		private _companyRepo: CompanyRepository
	) {
		this._data = [];
		this._nextIndex = 0;
		this._currentItem = undefined;
		this._countries = [];
		// this.countryNames = [];
	}

	ngOnInit() {
		this._dirSrv.getDir('country').data
			.subscribe(cs => this._countries = cs);
		this._route.params
			.subscribe(params => {
				this._data = JSON.parse(params['data']);
				this.getNext();
			});
	}

	getNext(): boolean {
		this._currentItem = undefined;
		if (this._nextIndex === this._data.length) {
			this._item.complete();
			return false;
		}
		this._currentItem = new ImportedItem(this._data[this._nextIndex++]);
		console.log(this._countries);
		this._currentItem.country = this._countries
			.find(c => c.name.trim().toLowerCase() === this._currentItem.countryName.toLowerCase());
		this._companyRepo.findByName(this._currentItem.companyName, true)
			.then(companies => {
				this._currentItem.company = (companies.length === 0 ? undefined : companies[0]);
				this._item.next(this._currentItem);
			});
		return true;
	}

	private resolveCurrent(): void {


	}

	private extractCountries(): string[] {
		return this._data
			.map(row => (row[4] || '').trim())
			.filter((v, i, a) => a.indexOf(v) === i)
			.sort();
	}
}

class ImportedItem {
	firstName: string;
	lastName: string;
	jobTitle: string;
	companyName: string;
	countryName: string;
	phone: string;
	email: string;
	www: string;

	country: Country;
	company: Company;

	constructor(dataRow: string[]) {
		this.firstName = (dataRow[0] || '').toString().trim();
		this.lastName = (dataRow[1] || '').toString().trim();
		this.jobTitle = (dataRow[2] || '').toString().trim();
		this.companyName = (dataRow[3] || '').toString().trim();
		this.countryName = (dataRow[4] || '').toString().trim();
		this.phone = (dataRow[5] || '').toString().trim();
		this.email = (dataRow[6] || '').toString().trim();
		this.www = (dataRow[7] || '').toString().trim();
	}
}
