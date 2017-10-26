import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Company, Contact, CompanyRepository } from '../../companies/core';
import { DirectoryService } from '../../directories';

@Component({
	selector: 'app-xupdate',
	templateUrl: './xupdate.component.html'
})
export class XupdateComponent implements OnInit {
	private _data: ImportedItem[];

	constructor(
		private _route: ActivatedRoute,
		private _dirSrv: DirectoryService,
		private _companyRepo: CompanyRepository
	) {
		this._data = [];
	}

	ngOnInit() {

		this._route.params
			.map(params => {
				const strs = <string[][]>JSON.parse(params['data']);
				return strs.reduce<ImportedItem[]>((items: ImportedItem[], sarr) => {
					const nItem = new ImportedItem(sarr);
					const eItem = items.find(i => i.companyKey === nItem.companyKey);
					if (eItem) {
						eItem.addDataFromItem(nItem);
					} else {
						items.push(nItem);
					}
					return items;
				}, []);
			})
			.mergeMap(
			item => this._dirSrv.getDir('country').data.take(1),
			(items, cs, num) => {
				items.forEach(item =>
					item.datas.forEach(data => {
						if (data.company.countryName) {
							const country = cs.find(c => c.name.trim().toLowerCase() === data.company.countryName.toLowerCase());
							data.company.country = country ? country._id : undefined;
						}
					})
				);
				return items;
			}
			)
			.subscribe(items => {
				this._data = items;
				this.processCountry();
			});
	}

	private processCountry() {
	}
}

class ImportedItem {
	companyKey: string;
	contactKey: string;
	company: Company;
	contactIndex: number;
	datas: {
		company: CompanyData,
		contact: ContactData
	}[];

	constructor(dataRow: string[]) {
		this.datas = [];
		this.addData(dataRow);
		this.companyKey = this.datas[0].company.name.toLowerCase();
		this.contactKey = this.datas[0].contact.firstName.toLowerCase() + this.datas[0].contact.lastName.toLowerCase();
	}

	addData(dataRow: string[]) {
		const companyData = <CompanyData>{
			name: (dataRow[3] || '').toString().trim(),
			countryName: (dataRow[4] || '').toString().trim(),
			country: undefined,
			website: (dataRow[7] || '').toString().trim()
		};
		const contactData = <ContactData>{
			firstName: (dataRow[0] || '').toString().trim(),
			lastName: (dataRow[1] || '').toString().trim(),
			email: (dataRow[6] || '').toString().trim(),
			phone: (dataRow[5] || '').toString().trim(),
			jobTitle: (dataRow[2] || '').toString().trim()
		};
		this.datas.push({
			company: companyData,
			contact: contactData
		});
	}
	addDataFromItem(aItem: ImportedItem) {
		aItem.datas.forEach(d => this.datas.push({ company: d.company, contact: d.contact }));
	}

	findUnknownCountry() {
		return this.datas.find(d => d.company.countryName && !d.company.country);
	}
	extractDataForCountryName(countryName: string) {
		return this.datas.filter(d => d.company.countryName.toLowerCase() === countryName.trim().toLowerCase());
	}
}

interface CompanyData {
	name: string;
	countryName: string;
	country: string;
	website: string;
}

interface ContactData {
	firstName: string;
	lastName: string;
	jobTitle: string;
	phone: string;
	email: string;
}
