import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Company } from './models/company.model';
import { Note } from './models/note.model';
import { CompanyRepository } from './repositories/company.repository';
import { DirectoryService } from '../directories/services/directory.service';

@Component({
	moduleId: module.id,
	selector: 'app-company-details',
	templateUrl: 'company-details.component.html'
})

export class CompanyDetailsComponent implements OnInit {
	company;
	note;
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _companyRepo: CompanyRepository,
		private _dirSrv: DirectoryService
	) {
		this.company = {};
		this.note = undefined;
	}

	ngOnInit() {
		this._route.params
			.switchMap(params => this._companyRepo.getById(params['id']))
			.subscribe(item => this.mapCompany(item));
	}

	gotoEdit(id): void {
		this._router.navigate(['company/edit', id]);
	}

	addNote() {
		this.note = { text: '' };
	}
	cancelNote() {
		this.note = undefined;
	}
	saveNote() {
		try {
			const newNote = new Note({ text: this.note.text.trim() });
			this.company.notes.unshift({ created: newNote.created, text: newNote.text });
		}
		catch (e) {
			console.log(e);
		}
		this.note = undefined;
	}

	private mapCompany(company: Company) {
		this.company.id = company._id;
		this.company.name = company.name;
		this.company.description = company.description;
		this.company.city = company.city;
		// this.company.activities =
		this.company.website = company.website;
		this.company.phone = company.phone;
		this.company.created = company.created;
		this.company.updated = company.updated;
		this.company.notes = company.notes
			.map(n => ({ created: n.created, text: n.text }));
		// this.comapny.contacts =
		this._dirSrv.getDir('country').data
			.subscribe(cs => {
				const country = cs.find(c => c._id == company.country);
				if (country) {
					this.company.country = country.name;
				}
			});
	}
}
