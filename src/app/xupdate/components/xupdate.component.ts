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
	private _countries: Country[];
	private _newCountry: Subject<string>;
	private _newCompany: Subject<ImportedItem>;
	private _exCompany: Subject<Company>;
	private _diffItem: Subject<ImportedItem>;

	logs: string[];
	newCountry: string;
	diffItem: {
		type: string,
		name: string,
		keys: string[],
		origs: string[],
		updts: string[]
	};

	constructor(
		private _route: ActivatedRoute,
		private _dirSrv: DirectoryService,
		private _companyRepo: CompanyRepository
	) {
		this._data = [];
		this._countries = [];
		this.logs = [];
		this._newCountry = new Subject<string>();
		this._exCompany = new Subject<Company>();
		this._newCompany = new Subject<ImportedItem>();
		this._diffItem = new Subject<ImportedItem>();
		this.newCountry = undefined;
		this.diffItem = undefined;
	}

	ngOnInit() {
		this._newCountry
			.subscribe(countryName => this.putNewCountry(countryName));
		this._exCompany
			.subscribe(company => this.processExistingCompany(company));
		this._newCompany
			.subscribe(item => this.putNewCompany(item));
		this._route.params
			.map(params => {
				const strs = <string[][]>JSON.parse(params['data']);
				return strs.map(s => new ImportedItem(s)).filter(i => i.isValid());
			})
			.mergeMap(
			item => this._dirSrv.getDir('country').data.take(1),
			(items, cs, num) => {
				items.forEach(item => {
					if (item.countryName) {
						const country = cs.find(c => c.name.trim().toLowerCase() === item.countryName.toLowerCase());
						item.countryId = country ? country._id : undefined;
					}
				});
				return items;
			})
			.subscribe(items => {
				this._data = items;
				this.execute();
			});
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

		const iNewCompany = this._data.find(i => i.newCompany());
		if (iNewCompany) {
			this._companyRepo.findByName(iNewCompany.companyName, true)
				.then(comps => {
					comps.length > 0 ? this._exCompany.next(comps[0]) : this._newCompany.next(iNewCompany);
				});
			return;
		}
		if (!this._newCompany.isStopped) {
			this._newCompany.complete();
		}
		if (!this._exCompany.isStopped) {
			this._exCompany.complete();
		}

		const csToStore: Company[] = [];
		const newContacts = this._data.filter(i => i.newContact());
		newContacts.forEach(item => {
			let company = csToStore.find(c => c._id === item.company._id);
			if (!company) {
				company = item.company;
				csToStore.push(company);
			}
			item.contact = new Contact({
				firstName: item.firstName,
				lastName: item.lastName,
				email: item.email,
				jobTitle: item.jobTitle,
				phone: item.phone
			});
			company.contacts.push(item.contact);
			this.logs.unshift('Contact ' + item.contact.name + ' added to ' + item.company.name + ' company');
		});
		this._companyRepo.storeMany(csToStore)
			.then(() => console.log('complete'));

		const iDiffItem = this._data
			.find(item => item.diffCompany().length > 0 || item.diffContact().length > 0);
		if (iDiffItem) {
			const compDiff = iDiffItem.diffCompany();
			const contDiff = iDiffItem.diffContact();
			this.diffItem = {
				type: compDiff.length > 0 ? 'Company' : 'Contact',
				name: compDiff.length > 0 ? iDiffItem.company.name : iDiffItem.contact.name,
				keys: [],
				origs: [],
				updts: []
			};
			if (compDiff.length > 0) {
				compDiff.forEach(s => {
					this.diffItem.keys.push(s);
					this.diffItem.origs.push(iDiffItem.company[s]);
					this.diffItem.updts.push(iDiffItem[s]);
				});
			} else {
				compDiff.forEach(s => {
					this.diffItem.keys.push(s);
					this.diffItem.origs.push(iDiffItem.contact[s]);
					this.diffItem.updts.push(iDiffItem[s]);
				});
			}
		}
	}



	private putNewCountry(name: string) {
		try {
			const nCountry = new Country({ name: name });
			this.addCountry(nCountry._id, nCountry.name);
		} catch (e) {
			this.newCountry = name;
		}
	}

	private putNewCompany(item: ImportedItem) {
		const nCompany = new Company({
			name: item.companyName,
			country: item.countryId,
			website: item.website,
			contacts: [
				new Contact({
					firstName: item.firstName,
					lastName: item.lastName,
					email: item.email,
					jobTitle: item.jobTitle,
					phone: item.phone
				})
			]
		});
		this._companyRepo.store(nCompany)
			.then(() => {
				this.logs.unshift('Company ' + nCompany.name + ' added to company\'s repository');
				this.logs.unshift('Contact ' + nCompany.contacts[0].name + ' added to ' + nCompany.name + ' company');
				this.processExistingCompany(nCompany);
			});
	}

	private processExistingCompany(company: Company) {
		this._data
			.filter(i => i.newCompany() && i.companyName.toLowerCase() === company.name.toLowerCase())
			.forEach(i => {
				i.company = company;
				const contact = company.contacts.find(c =>
					c.firstName.trim().toLowerCase() === i.firstName.toLowerCase()
					&& c.lastName.trim().toLowerCase() === i.lastName.toLowerCase());
				i.contact = contact;
			});
		this.execute();
	}

	addCountry(code: string, aname: string) {
		const rCode = code.trim();
		const name = aname || this.newCountry;
		if (rCode.length < 3) {
			return;
		}
		this.newCountry = undefined;
		const nCountry = new Country({ _id: rCode, name: name });
		this._dirSrv.storeEntry('country', nCountry);
		this._data
			.filter(i => i.countryName.toLowerCase() === name.toLowerCase())
			.forEach(i => i.countryId = nCountry._id);
		this.logs.unshift(name + ' added to country\'s directory');
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
	website: string;

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
		this.website = (dataRow[7] || '').toString().trim();
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
	diffCompany(): string[] {
		const res = [];
		if (this.company.name !== this.companyName) {
			res.push('name');
		}
		if (this.company.country !== this.countryId) {
			res.push('country');
		}
		if (this.company.website !== this.website) {
			res.push('website');
		}
		return res;
	}
	diffContact(): string[] {
		const res = [];
		if (this.contact.firstName !== this.firstName) {
			res.push('firstName');
		}
		if (this.contact.lastName !== this.lastName) {
			res.push('lastName');
		}
		if (this.contact.jobTitle !== this.jobTitle) {
			res.push('jobTitle');
		}
		if (this.contact.phone !== this.phone) {
			res.push('phone');
		}
		if (this.contact.email !== this.email) {
			res.push('email');
		}
		return res;
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
