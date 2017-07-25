import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { DirectoryService } from '../../directories';
import { Company, Contact, CompanyRepository } from '../core';
import { Note } from '../core/models/note.model';

const NEWPERIOD = 365 * 24 * 60 * 60 * 1000;

@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html',
	styleUrls: ['./company-details.component.css']
})

export class CompanyDetailsComponent implements OnInit {
	private _domainCompany: Company;

	domainItem: Observable<Company>;
	company;
	note;
	indNoteToDel;
	includeFired = false;
	checkGlyph = 'unchecked';

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _location: Location,
		private _companyRepo: CompanyRepository,
		private _dirSrv: DirectoryService
	) {
		this.company = {};
		this.cancelNote();
	}

	ngOnInit() {
		this.domainItem = this._route.params
			.switchMap(params => this._companyRepo.getById(params['id']));
		this.domainItem.subscribe(item => this.mapCompany(item));
	}

	gotoList(): void {
		this._router.navigate(['company']);
	}

	async gotoEdit(): Promise<void> {
		const item = await this.domainItem;
		this._router.navigate(['company/edit', this._domainCompany._id]);
	}

	contactDetails(contactId): void {
		this._router.navigate(['contact/details', this._domainCompany._id, contactId]);
	}

	toggleActive(): void {
		this.includeFired = !this.includeFired;
		this.checkGlyph = this.includeFired ? 'check' : 'unchecked';
		this.mapContacts(this.includeFired);
	}

	addContact(): void {
		this._router.navigate(['contact/edit', this._domainCompany._id, '__new__']);
	}

	addParticipant(): void {
		this._router.navigate(['participant/add', { company_id: this._domainCompany._id }]);
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
	saveNote() {
		const newNote = new Note({ text: this.note.text.trim() });
		this._domainCompany.notes.unshift(newNote);
		this._companyRepo.store(this._domainCompany)
			.then(() => this.company.notes.unshift({ created: newNote.created, text: newNote.text }))
			.catch(e => console.log(e));
		this.cancelNote();
	}
	removeNote(i) {
		if (this.indNoteToDel === -1) {
			this.indNoteToDel = i;
			return;
		}
		const ind = this.indNoteToDel;
		this._domainCompany.notes.splice(ind, 1);
		this._companyRepo.store(this._domainCompany)
			.then(() => this.company.notes.splice(ind, 1))
			.catch(e => console.log(e));
		this.cancelNote();
	}

	private mapCompany(domain: Company) {
		this._domainCompany = domain;
		const company = domain;
		this.company.id = company._id;
		this.company.name = company.name;
		this.company.description = company.description;
		this.company.city = company.city;
		this.company.website = company.website;
		this.company.phone = company.phone;
		this.company.created = company.created;
		this.company.updated = company.updated;
		this.mapContacts(this.includeFired);
		this.company.notes = company.notes
			.map(n => ({ created: n.created, text: n.text }));
		this._dirSrv.getDir('country').data
			.subscribe(cs => {
				const country = cs.find(c => c._id === company.country);
				if (country) {
					this.company.country = country.name;
				}
			});
		this._dirSrv.getDir('activity').data
			.subscribe(as => {
				this.company.activities = as
					.filter(a => company.activities.includes(a._id))
					.map(a => a.name)
					.join(', ');
			});
	}

	private mapContacts(withFired) {
		this.company.contacts = this._domainCompany.contacts
			.filter(c => withFired || c.active)
			.map(c => new ContactListVm(c));
	}
}

class ContactListVm {
	id: string;
	name: string;
	jobTitle: string;
	// jobResponsibilities: string[];
	// buyContents: string[];
	// sellContents: string[];
	// phone: string;
	// mobile: string;
	// email: string;
	active: boolean;
	isNew: boolean;
	// created: Date;
	// updated: Date;

	constructor(contact: Contact) {
		this.id = contact._id;
		this.name = contact.name;
		this.jobTitle = contact.jobTitle;
		this.isNew = contact.active && new Date().getTime() - new Date(contact.created).getTime() < NEWPERIOD;
		this.active = contact.active;
	}
}
