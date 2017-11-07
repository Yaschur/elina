import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import { Company, Contact, CompanyRepository } from '../../companies/core';
import { DirectoryService, Country } from '../../directories';

@Component({
	selector: 'app-xupdate',
	templateUrl: './xupdate.component.html'
})
export class XupdateComponent implements OnInit {
	private _data: ImportedItem[];
	private _newCountry = new Subject<string>();
	private _variantCompany = new Subject<ImportedItem>();

	newCountry: string;
	logs: string[];

	constructor(
		private _route: ActivatedRoute,
		private _dirSrv: DirectoryService,
		private _companyRepo: CompanyRepository
	) {
		this._data = [];
		this._newCountry = new Subject();
		this._variantCompany = new Subject();
		this.logs = [];
	}

	ngOnInit() {
		this._newCountry.subscribe(s => this.putNewCountry(s));
		this._variantCompany.subscribe(i => this.putCompany(i));
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
				this.processData();
			});
	}

	private processData() {
		const newCountries = this._data
			.filter(i => i.findUnknownCountry());
		if (newCountries.length !== 0) {
			this._newCountry.next(newCountries[0].findUnknownCountry());
		}
		const variantCompanies = this._data
			.filter(i => i.extractCompanyVariantIndexes().length > 0);
		if (variantCompanies.length !== 0) {
			this._variantCompany.next(variantCompanies[0]);
		}
	}

	private putNewCountry(name: string) {
		try {
			const nCountry = new Country({ name: name });
			this.postNewCountry(nCountry);
		} catch (e) {
			this.newCountry = name;
		}
	}

	private putCompany(item: ImportedItem) {
		const varInds = item.extractCompanyVariantIndexes();
		
	}

	addCountry(code: string) {
		const rCode = code.trim();
		const name = this.newCountry;
		if (rCode.length < 3) {
			return;
		}
		this.newCountry = undefined;
		const nCountry = new Country({ _id: rCode, name: name });
		this.postNewCountry(nCountry);
	}

	postNewCountry(country: Country) {
		this._dirSrv.storeEntry('country', country);
		this._data
			.map(d => d.extractDataForCountryName(country.name))
			.reduce((x, y) => x.concat(y), [])
			.forEach(d => d.company.country = country._id);
		this.logs.unshift(country.name + ' (' + country._id + ') is added to country\'s directory');
		this.processData();
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
		const d = this.datas.find(data => data.company.countryName && !data.company.country);
		return d ? d.company.countryName : undefined;
	}
	extractDataForCountryName(countryName: string) {
		return this.datas.filter(d => d.company.countryName.toLowerCase() === countryName.trim().toLowerCase());
	}
	extractCompanyVariantIndexes() {
		const companyData = <CompanyData[]>[];
		const dataIndexes = <Number[]>[];
		if (this.company) {
			companyData.push(<CompanyData>{
				country: this.company.country,
				name: this.company.name,
				website: this.company.website
			});
		}
		this.datas.forEach((cd, ind) => {
			const fInd = companyData.findIndex(fcd =>
				fcd.country === cd.company.country && fcd.name === cd.company.name && fcd.website === cd.company.website);
			if (fInd < 0) {
				companyData.push(cd.company);
				dataIndexes.push(ind);
			}
		});
		return dataIndexes;
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
