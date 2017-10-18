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
		this._dirSrv.getDir('country').data
			.subscribe(cs => this._countries = cs);
		this._route.params
			.map(params => <string[][]>JSON.parse(params['data']))
			.take(1)
			.subscribe({
				next: ss => this._data = ss.map(s => new ImportedItem(s)),
				complete: () => this.execute()
			});
	}

	private execute() {
		let curItem: ImportedItem;
		do {
			curItem = this._data.pop();
			if (!curItem) {
				return;
			}
			if (!curItem.companyName || !(curItem.firstName || curItem.lastName)) {
				continue;
			}
		} while (true);

		// TODO: here to continue...
		// this._companyRepo.findByName(curItem.companyName)
		// 	.then(exstCompany => {
		// 		if (curItem.countryName) {
		// 			curItem.countryId = this._countries.find(c => c.name.trim().toLowerCase() === curItem.countryName.toLowerCase())
		// 		}
		// 	});
		// end of TODO

		// if (!item.companyName || !(item.firstName || item.lastName)) {
		// 	return;
		// }
		// let company = (await this._companyRepo.findByName(item.companyName, true))[0];
		// let country;
		// if (!company) {
		// 	if (item.countryName) {
		// 		country = this._countries
		// 			.find(c => c.name.trim().toLowerCase() === item.countryName.toLowerCase());
		// 		if (!country) {
		// 			this._dataToInteract.push(item);
		// 			return;
		// 		}
		// 	}
		// 	company = new Company({ name: item.companyName, country: country ? country._id : undefined });
		// 	await this._companyRepo.store(company);
		// 	this.logs.push('Company ' + company.name + ' is added to database');
		// }
	}

	private getNext(): boolean {
		this._curIndex++;
		if (this._curIndex >= this._data.length) {
			return false;
		}
		const curItem = this._data[this._curIndex];
		const country = curItem.countryName ? this._countries.find(c => c.name.trim().toLowerCase() === curItem.countryName.toLowerCase())
			|| undefined : undefined;
		const company = (await this._companyRepo.findByName(curItem.companyName, true))[0];

		return false;
	}

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

	newCountry(): boolean {
		return this.countryName && !this.countryId;
	}
	newCompany(): boolean {
		return this.company ? true : false;
	}
}
