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

	constructor(
		private _route: ActivatedRoute,
		private _dirSrv: DirectoryService,
		private _companyRepo: CompanyRepository
	) {
		this._data = [];
		this._curIndex = -1;
		this._countries = [];
		this.logs = [];
	}

	ngOnInit() {
		// this._dirSrv.getDir('country').data
		// 	.subscribe(cs => this._countries = cs);
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
		const newCountries = this._data.filter(item => item.newCountry());
		const newCompanies = this._data.filter(item => item.newCompany());
		const newContacts = this._data.filter(item => item.newContact());
		this.logs.unshift('New countries found: ' + newCountries.length);
		this.logs.unshift('New companies found: ' + newCompanies.length);
		this.logs.unshift('New contacts found: ' + newContacts.length);
	}

	// private getNext(): boolean {
	// 	this._curIndex++;
	// 	if (this._curIndex >= this._data.length) {
	// 		return false;
	// 	}
	// 	const curItem = this._data[this._curIndex];
	// 	const country = curItem.countryName ? this._countries.find(c => c.name.trim().toLowerCase() === curItem.countryName.toLowerCase())
	// 		|| undefined : undefined;
	// 	const company = (await this._companyRepo.findByName(curItem.companyName, true))[0];

	// 	return false;
	// }

	// addCountry(code: string) {
	// 	const rCode = code.trim();
	// 	if (rCode.length < 3) {
	// 		return;
	// 	}
	// 	const curItem = this._data[this._curIndex];
	// 	this._dirSrv.storeEntry('country', new Country({ _id: rCode, name: curItem.countryName }));
	// 	curItem.countryId = rCode;
	// }
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
