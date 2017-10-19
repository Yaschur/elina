import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DirectoryService, Country } from '../../directories';
import { CompanyRepository, Company, Contact } from '../../companies/core';
import { Subject } from 'rxjs/Subject';

@Component({
	selector: 'app-xupdate',
	templateUrl: './xupdate.component.html'
})
export class XupdateComponent implements OnInit {

	private _data: ImportedItem[];
	private _curIndex: number;
	private _countries: Country[];

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
	}

	private execute() {
		const item = this._data.find(i => i.newCountry());
		if (item) {
			this.newCountry = item.countryName;
			return;
		}
	}

	addCountry(code: string) {
		const rCode = code.trim();
		const cName = this.newCountry;
		if (rCode.length < 3) {
			return;
		}
		this._dirSrv.storeEntry('country', new Country({ _id: rCode, name: cName }));
		this.newCountry = undefined;
		this._data
			.filter(i => i.countryName.toLowerCase() === cName.toLowerCase())
			.forEach(i => i.countryId = rCode);
		this.logs.unshift(cName + ' added to countries directory');
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
