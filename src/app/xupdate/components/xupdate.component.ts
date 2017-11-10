import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import { Company, Contact, CompanyRepository } from '../../companies/core';
import { DirectoryService, Country } from '../../directories';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-xupdate',
	templateUrl: './xupdate.component.html'
})
export class XupdateComponent implements OnInit {
	private _newOnly: boolean;
	private _newCountry = new Subject<string>();
	private _newCompany = new Subject<ImportedItem>();
	private _variantCompany = new Subject<ImportedItem>();
	private _variantContact = new Subject<ImportedItem>();

	data: ImportedItem[];
	newCountry: string;
	variantCompany: ImportedItem;
	variantContactIndex: number;
	commonStats: string;
	logs: string[];

	constructor(
		private _route: ActivatedRoute,
		private _dirSrv: DirectoryService,
		private _companyRepo: CompanyRepository
	) {
		this.data = [];
		this._newOnly = false;
		this.variantContactIndex = -1;
		this.commonStats = 'File is loaded. Data is prepared for processing...';
		this._newCountry = new Subject();
		this._newCompany = new Subject();
		this._variantCompany = new Subject();
		this._variantContact = new Subject();
		this.logs = [];
	}

	ngOnInit() {
		this._newCountry.subscribe(s => this.putNewCountry(s));
		this._variantCompany.subscribe(i => this.putCompany(i));
		this._variantContact.subscribe(i => this.putContact(i));
		this._route.params
			.map(params => {
				this._newOnly = params['newOnly'] === 'true';
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
							data.company.country = country ? country._id : '';
						} else {
							data.company.country = '';
						}
					})
				);
				return items;
			}
			)
			.subscribe(items => {
				this.data = items;
				this.processCountries();
			});
	}

	private processCountries() {
		const newCountries = this.data
			.filter(i => i.findUnknownCountry());
		this.commonStats = 'Countries are being processed, records remained: ' + newCountries.length;
		if (newCountries.length !== 0) {
			this._newCountry.next(newCountries[0].findUnknownCountry());
			return;
		}
		this._newCountry.complete();
		this.processCompanies();
	}

	private processCompanies() {
		const unprocCompany = this.data.filter(i => !i.company);
		this.commonStats = 'Companies are being processed, records remained: ' + unprocCompany.length;
		if (unprocCompany.length > 0) {
			this._companyRepo.findByName(unprocCompany[0].companyKey, true)
				.then(companies => {
					if (companies.length > 0) {
						unprocCompany[0].company = companies[0];
					}
					this._variantCompany.next(unprocCompany[0]);
				});
			return;
		}
		this._variantCompany.complete();
		this.processContacts();
	}

	private processContacts() {
		this.commonStats = 'Contacts are being processed, records remained: ' + this.data.reduce((sum, ii) => sum + ii.datas.length, 0);
		if (this.data.length > 0) {
			this._variantContact.next(this.data[0]);
			return;
		}
		this._variantContact.complete();
		this.commonStats = 'Import is done. You can check changes made below.';
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
		if ((this._newOnly || varInds.length === 0) && item.company) {
			this.processCompanies();
			return;
		}
		if (varInds.length > 1 || (item.company && varInds.length > 0)) {
			this.variantCompany = item;
			return;
		}
		const cData = item.datas[varInds[0]].company;
		const nCompany = new Company({
			name: cData.name,
			country: cData.country,
			website: cData.website
		});
		item.company = nCompany;
		this.postCompany(nCompany);
	}

	private putContact(item: ImportedItem) {
		if (item.datas.length === 0) {
			this.data.shift();
			this.processContacts();
			return;
		}
		while (item.datas.length > 0) {
			const cInd = item.resolveContact(this._newOnly);
			if (cInd > 0) {
				this.variantContactIndex = cInd;
				return;
			}
		}
		this.data.shift();
		if (item.companyToSave) {
			this.postCompany(item.company);
			return;
		}
		this.processContacts();
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
		this.data
			.map(d => d.extractDataForCountryName(country.name))
			.reduce((x, y) => x.concat(y), [])
			// TODO: check country bug here
			.forEach(d => d.company.country = country._id);
		this.logs.unshift(country.name + ' (' + country._id + ') is added to country\'s directory');
		this.processCountries();
	}

	resolveCompany(ind: number) {
		const companyToResolve = this.variantCompany;
		this.variantCompany = undefined;
		companyToResolve.resolveCompany(ind);
		if (ind < 0) {
			this.processCompanies();
			return;
		}
		this.postCompany(companyToResolve.company);
	}

	resolveContact(update: boolean) {
	}

	postCompany(company: Company, processingContacts: boolean = false) {
		this._companyRepo.store(company)
			.then(() => processingContacts ? this.processContacts() : this.processCompanies());
	}
}

class ImportedItem {

	private companyResolved: boolean;

	companyToSave: boolean;

	companyKey: string;
	company: Company;
	datas: {
		company: CompanyData,
		contact: ContactData
	}[];

	constructor(dataRow: string[]) {
		this.companyResolved = false;
		this.companyToSave = false;
		this.datas = [];
		this.addData(dataRow);
		this.companyKey = this.datas[0].company.name.toLowerCase();
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
		const dataIndexes = <number[]>[];
		if (this.companyResolved) {
			return dataIndexes;
		}
		const companyData = <CompanyData[]>[];
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
	resolveCompany(ind: number) {
		this.companyResolved = true;
		if (ind > -1) {
			const data = this.datas[ind].company;
			if (!this.company) {
				this.company = new Company({
					name: data.name,
					country: data.country,
					website: data.website
				});
			} else {
				this.company.name = data.name;
				this.company.country = data.country;
				this.company.website = data.website;
				this.company.updated = new Date();
			}
		}
	}
	getFirstContactIndex() {
		const data = this.datas[0].contact;
		return this.company.contacts.findIndex(c =>
			c.firstName.trim().toLowerCase() === data.firstName.toLowerCase()
			&& c.lastName.trim().toLowerCase() === data.lastName.toLowerCase()
		);
	}
	resolveContact(newOnly: boolean) {
		const cInd = this.getFirstContactIndex();
		const data = this.datas.shift();
		if (cInd < 0) {
			this.company.contacts.push(
				new Contact({
					firstName: data.contact.firstName,
					lastName: data.contact.lastName,
					email: data.contact.email,
					jobTitle: data.contact.jobTitle,
					phone: data.contact.phone
				})
			);
			this.companyToSave = true;
			return -1;
		}
		if (newOnly) {
			return -1;
		}
		const contact = this.company.contacts[cInd];
		if (contact.firstName !== data.contact.firstName || contact.lastName !== data.contact.lastName
			|| contact.jobTitle !== data.contact.jobTitle || contact.phone !== data.contact.phone
			|| contact.email !== data.contact.email) {
			this.datas.unshift(data);
			return cInd;
		}
		return -1;
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
