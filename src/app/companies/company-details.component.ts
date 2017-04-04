import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Company } from './models/company.model';
import { Note } from './models/note.model';
import { CompanyRepository } from './repositories/company.repository';
import { DirectoryService } from '../directories/services/directory.service';

@Component({
	moduleId: module.id,
	selector: 'app-company-details',
	templateUrl: 'company-details.component.html',
	styleUrls: ['company-details.component.css']
})

export class CompanyDetailsComponent implements OnInit {
	domainItem: Company;
	company;
	note;
	indNoteToDel;
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _companyRepo: CompanyRepository,
		private _dirSrv: DirectoryService
	) {
		this.company = {};
		this.cancelNote();
	}

	ngOnInit() {
		this._route.params
			.switchMap(params => this._companyRepo.getById(params['id']))
			.subscribe(item => {
				this.domainItem = item;
				this.mapCompany();
			});
	}

	gotoEdit(id): void {
		this._router.navigate(['company/edit', id]);
	}

	editContact(contactId): void {
		this._router.navigate(['contact/edit', this.domainItem._id, contactId]);
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
		this.domainItem.notes.unshift(newNote);
		this._companyRepo.store(this.domainItem)
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
		this.domainItem.notes.splice(ind, 1);
		this._companyRepo.store(this.domainItem)
			.then(() => this.company.notes.splice(ind, 1))
			.catch(e => console.log(e));
		this.cancelNote();
	}

	private mapCompany() {
		const company = this.domainItem;
		this.company.id = company._id;
		this.company.name = company.name;
		this.company.description = company.description;
		this.company.city = company.city;
		this.company.website = company.website;
		this.company.phone = company.phone;
		this.company.created = company.created;
		this.company.updated = company.updated;
		this.company.notes = company.notes
			.map(n => ({ created: n.created, text: n.text }));
		// this.company.contacts =
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
}
