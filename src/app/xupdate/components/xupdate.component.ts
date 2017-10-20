import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { DirectoryService, Country } from '../../directories';
import { CompanyRepository, Company, Contact } from '../../companies/core';

@Component({
	selector: 'app-xupdate',
	templateUrl: './xupdate.component.html'
})
export class XupdateComponent implements OnInit {

	private _data: ImportedItem[];
	private _curIndex: number;
	private _countries: Country[];
	private _newCountry: Subject<string>;

	logs: string[];
	newCountry: string;

	constructor(
		private _route: ActivatedRoute,
		private _dirSrv: DirectoryService,
		private _companyRepo: CompanyRepository
	) {
		this._data = [];
		this._curIndex = -1;
		this._countries = [];
		this.logs = [];
		this._newCountry = new Subject<string>();
		this.newCountry = undefined;
	}

	ngOnInit() {
		this._route.params
			.map(params => <string[][]>JSON.parse(params['data']))
			.take(1)
			.switchMap(ss => ss.map(s => new ImportedItem(s)))
			.filter(item => item.isValid())
			.mergeMap(
			item => this._dirSrv.getDir('country').data.take(1),
			(item, cs, num) => {
				if (item.countryName) {
					const country = cs.find(c => c.name.trim().toLowerCase() === item.countryName.toLowerCase());
					item.countryId = country ? country._id : undefined;
				}
				return item;
			})
			.mergeMap(
			item => this._companyRepo.findByName(item.companyName, true),
			(item, comps) => {
				if (comps.length !== 0) {
					const company = comps[0];
					item.company = company;
					const contact = company.contacts.find(c =>
						c.firstName.trim().toLowerCase() === item.firstName.toLowerCase()
						&& c.lastName.trim().toLowerCase() === item.lastName.toLowerCase());
					item.contact = contact;
				}
				return item;
			})
			.subscribe({
				next: item => this._data.push(item),
				error: e => console.log('error: ' + e),
				complete: () => this.execute()
			});
		this._newCountry
			.subscribe(this.putNewCountry);
	}

	private execute() {
		const iNewCountry = this._data.find(i => i.newCountry());
		if (iNewCountry) {
			this._newCountry.next(iNewCountry.countryName);
			return;
		}
		if (!this._newCountry.isStopped) {
			this._newCountry.complete();
		}
	}

	private putNewCountry(name: string) {
		this.newCountry = name;
	}

	addCountry(code: string) {
		const rCode = code.trim();
		const name = this.newCountry;
		if (rCode.length < 3) {
			return;
		}
		this.newCountry = undefined;
		this._dirSrv.storeEntry('country', new Country({ _id: rCode, name: name }));
		this._data
			.filter(i => i.countryName.toLowerCase() === name.toLowerCase())
			.forEach(i => i.countryId = rCode);
		this.logs.unshift(name + ' added to countries directory');
		this.execute();
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

	countryId: string;
	company: Company;
	contact: Contact;

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

	isValid(): boolean {
		return this.companyName.length !== 0 && (this.firstName.length !== 0 || this.lastName.length !== 0);
	}
	newCountry(): boolean {
		return this.countryName && !this.countryId;
	}
	newCompany(): boolean {
		return !this.company;
	}
	newContact(): boolean {
		return !this.contact;
	}
}

class NewCountry {
	name: string;
	code: string;
	constructor(name: string) {
		this.name = name;
		this.code = '';
	}
}
