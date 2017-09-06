import { Injectable } from '@angular/core';

import { DirectoryService, Country, Activity, AddInfo, ContentResponsibility, JobResponsibility } from '../../../directories';
import { Company, Contact } from '../../core';
import { CompanyBaseVm } from '../models/company-base-vm.model';
import { CompanyDetailVm } from '../models/company-detail-vm.model';
import { ContactBaseVm } from '../models/contact-base-vm.model';
import { ContactDetailVm } from '../models/contact-detail-vm.model';

const NEWPERIOD = 365 * 24 * 60 * 60 * 1000;

@Injectable()
export class CompanyVmService {
	private countries: Country[] = [];
	private activities: Activity[] = [];
	private addinfos: AddInfo[] = [];
	private contentresponsibilities: ContentResponsibility[] = [];
	private jobresponsibilities: JobResponsibility[] = [];

	constructor(
		private _dirSrv: DirectoryService
	) {
		this._dirSrv.getDir('country').data
			.subscribe(items => this.countries = items);
		this._dirSrv.getDir('activity').data
			.subscribe(items => this.activities = items);
		this._dirSrv.getDir('addinfo').data
			.subscribe(items => this.addinfos = items);
		this._dirSrv.getDir('contentresponsibility').data
			.subscribe(items => this.contentresponsibilities = items);
		this._dirSrv.getDir('jobresponsibility').data
			.subscribe(items => this.jobresponsibilities = items);
	}

	mapToCompanyBaseVm(company: Company): CompanyBaseVm {
		const r = new CompanyBaseVm();
		r.id = company._id;
		r.city = company.city;
		r.activitiesNum = company.activities.length;
		r.contactsNum = company.contacts
			.filter(c => c.active)
			.length;
		r.country = (this.countries.find(c => c._id === company.country) || { name: '' }).name;
		r.isNew = new Date().getTime() - new Date(company.created).getTime() < NEWPERIOD;
		r.name = company.name;
		return r;
	}

	mapToCompanyDetailVm(company: Company): CompanyDetailVm {
		const r = <CompanyDetailVm>this.mapToCompanyBaseVm(company);
		r.activities = this.activities.filter(a => company.activities.includes(a._id))
			.map(a => a.name)
			.join(', ');
		r.contacts = company.contacts
			.map(c => this.mapToContactBaseVm(c))
			.sort(this.sortContacts);
		r.created = company.created;
		r.description = company.description;
		r.notes = company.notes
			.map(n => ({ created: n.created, text: n.text }));
		r.phone = company.phone;
		r.updated = company.updated;
		r.website = company.website;
		return r;
	}

	mapToContactBaseVm(contact: Contact): ContactBaseVm {
		const r = new ContactBaseVm();
		r.active = contact.active;
		r.id = contact._id;
		r.isNew = contact.active && new Date().getTime() - new Date(contact.created).getTime() < NEWPERIOD;
		r.jobTitle = contact.jobTitle;
		r.name = contact.name;
		return r;
	}

	mapToContactDetailVm(contact: Contact): ContactDetailVm {
		const r = <ContactDetailVm>this.mapToContactBaseVm(contact);
		r.addInfos = this.addinfos.filter(a => contact.addInfos.includes(a._id))
			.map(a => a.name)
			.join(', ');
		r.buyContents = this.contentresponsibilities.filter(a => contact.buyContents.includes(a._id))
			.map(a => a.name)
			.join(', ');
		r.created = contact.created;
		r.email = contact.email;
		r.firstName = contact.firstName;
		r.jobResponsibilities = this.jobresponsibilities.filter(a => contact.jobResponsibilities.includes(a._id))
			.map(a => a.name)
			.join(', ');
		r.lastName = contact.lastName;
		r.mobile = contact.mobile;
		r.phone = contact.phone;
		r.sellContents = this.contentresponsibilities.filter(a => contact.sellContents.includes(a._id))
			.map(a => a.name)
			.join(', ');
		r.updated = contact.updated;
		return r;
	}

	private sortContacts(a: ContactBaseVm, b: ContactBaseVm): number {
		const aName = a.name.toUpperCase();
		const bName = b.name.toUpperCase();
		if (aName < bName) {
			return -1;
		}
		if (aName > bName) {
			return 1;
		}
		return 0;
	}
}
