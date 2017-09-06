import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { Company, CompanyRepository } from '../../core';
import { Note } from '../../core/models/note.model';
import { CompanyVmService } from '../services/company-vm.service';
import { CompanyDetailVm } from '../models/company-detail-vm.model';
import { ContactBaseVm } from '../models/contact-base-vm.model';

@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html',
	styleUrls: ['./company-details.component.css']
})

export class CompanyDetailsComponent implements OnInit {
	domainItem: Observable<Company>;
	company: CompanyDetailVm = new CompanyDetailVm();
	contacts: ContactBaseVm[] = [];
	note;
	indNoteToDel;
	includeFired = false;
	checkGlyph = 'unchecked';

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _location: Location,
		private _companyRepo: CompanyRepository,
		private _vmSrv: CompanyVmService
	) {
		this.cancelNote();
		this.domainItem = this._route.params
			.switchMap(params => this._companyRepo.getById(params['id']));
	}

	ngOnInit() {
		this.domainItem
			.subscribe(item => {
				if (item) {
					this.company = this._vmSrv.mapToCompanyDetailVm(item);
					this.contacts = this.company.contacts.filter(c => c.active);
				}
			});
	}

	gotoList(): void {
		this._router.navigate(['company']);
	}

	gotoEdit(): void {
		this._router.navigate(['company/edit', this.company.id]);
	}

	contactDetails(contactId): void {
		this._router.navigate(['contact/details', this.company.id, contactId]);
	}

	toggleActive(): void {
		this.includeFired = !this.includeFired;
		this.checkGlyph = this.includeFired ? 'check' : 'unchecked';
		this.contacts = this.company.contacts
			.filter(c => this.includeFired || c.active);
	}

	addContact(): void {
		this._router.navigate(['contact/edit', this.company.id, '__new__']);
	}

	addNote() {
		this.note = { text: '' };
	}
	cancelNote() {
		if (this.note) {
			this.note = undefined;
		}
		if (this.indNoteToDel !== -1) {
			this.indNoteToDel = -1;
		}
	}
	async saveNote() {
		const newNote = new Note({ text: this.note.text.trim() });
		const dCompany = await this._companyRepo.getById(this.company.id);
		dCompany.notes.unshift(newNote);
		await this._companyRepo.store(dCompany);
		this.company.notes.unshift({ created: newNote.created, text: newNote.text });
		this.cancelNote();
	}
	async removeNote(i) {
		if (this.indNoteToDel === -1) {
			this.indNoteToDel = i;
			return;
		}
		const ind = this.indNoteToDel;
		const dCompany = await this._companyRepo.getById(this.company.id);
		dCompany.notes.splice(ind, 1);
		await this._companyRepo.store(dCompany);
		this.company.notes.splice(ind, 1);
		this.cancelNote();
	}
}

// 	private mapCompany(domain: Company) {
// 		this._domainCompany = domain;
// 		const company = domain;
// 		this.company.id = company._id;
// 		this.company.name = company.name;
// 		this.company.description = company.description;
// 		this.company.city = company.city;
// 		this.company.website = company.website;
// 		this.company.phone = company.phone;
// 		this.company.created = company.created;
// 		this.company.updated = company.updated;
// 		this.mapContacts(this.includeFired);
// 		this.company.notes = company.notes
// 			.map(n => ({ created: n.created, text: n.text }));
// 		this._dirSrv.getDir('country').data
// 			.subscribe(cs => {
// 				const country = cs.find(c => c._id === company.country);
// 				if (country) {
// 					this.company.country = country.name;
// 				}
// 			});
// 		this._dirSrv.getDir('activity').data
// 			.subscribe(as => {
// 				this.company.activities = as
// 					.filter(a => company.activities.includes(a._id))
// 					.map(a => a.name)
// 					.join(', ');
// 			});
// 	}

// 	private mapContacts(withFired) {
// 		this.company.contacts = this._domainCompany.contacts
// 			.filter(c => withFired || c.active)
// 			.map(c => new ContactListVm(c))
// 			.sort((a, b) => {
// 				const aName = a.name.toUpperCase();
// 				const bName = b.name.toUpperCase();
// 				if (aName < bName) {
// 					return -1;
// 				}
// 				if (aName > bName) {
// 					return 1;
// 				}
// 				return 0;
// 			});
// 	}
// }

// class ContactListVm {
// 	id: string;
// 	name: string;
// 	jobTitle: string;
// 	// jobResponsibilities: string[];
// 	// buyContents: string[];
// 	// sellContents: string[];
// 	// phone: string;
// 	// mobile: string;
// 	// email: string;
// 	active: boolean;
// 	isNew: boolean;
// 	// created: Date;
// 	// updated: Date;

// 	constructor(contact: Contact) {
// 		this.id = contact._id;
// 		this.name = contact.name;
// 		this.jobTitle = contact.jobTitle;
// 		this.isNew = contact.active && new Date().getTime() - new Date(contact.created).getTime() < NEWPERIOD;
// 		this.active = contact.active;
// 	}
// }
