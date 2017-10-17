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

	private _item = new Subject<ImportedItem>();
	item = this._item.asObservable();

	constructor(
		private _route: ActivatedRoute,
		private _dirSrv: DirectoryService,
		private _companyRepo: CompanyRepository
	) {
		this._data = [];
		this._curIndex = -1;
	}

	ngOnInit() {
		this._route.params
			.subscribe(params => {
				this._data = (<string[][]>JSON.parse(params['data']))
					.map(d => new ImportedItem(d));
				this.getNext()
					.then(() => { });
			});
	}

	async getNext() {
		this._curIndex++;
		if (this._curIndex >= this._data.length) {
			this._item.complete();
			return;
		}
		const curItem = this._data[this._curIndex];
		const company = (await this._companyRepo.findByName(curItem.companyName, true))[0];
		curItem.company = company || undefined;
		this._dirSrv.getDir('country').data
			.map(de => {
				return de.find(c => c.name.trim().toLowerCase() === curItem.countryName.toLowerCase());
			})
			.subscribe(c => {
				curItem.countryId = c ? c._id : undefined;
				this._item.next(curItem);
			});
	}

	addCountry(code: string) {
		const rCode = code.trim();
		if (rCode.length < 3) {
			return;
		}
		const curItem = this._data[this._curIndex];
		this._dirSrv.storeEntry('country', new Country({ _id: rCode, name: curItem.countryName }));
		curItem.countryId = rCode;
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
