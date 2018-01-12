import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { Company, CompanyRepository } from '../../core';
import { Note } from '../../core/models/note.model';
import { CompanyVmService } from '../services/company-vm.service';
import { CompanyDetailsVm } from '../models/company-details-vm.model';
import { ContactBaseVm } from '../models/contact-base-vm.model';

@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html',
	styleUrls: [
		'./panels/panels.css',
		'./company-details.component.css'
	]
})

export class CompanyDetailsComponent implements OnInit {
	domainItem: Observable<Company>;
	company: CompanyDetailsVm = new CompanyDetailsVm();
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
					this.company = this._vmSrv.mapToCompanyDetailsVm(item);
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
