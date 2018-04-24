import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { Company, CompanyRepository } from '../../core';
import { Note } from '../../core/models/note.model';
import { CompanyVmService } from '../services/company-vm.service';
import { CompanyDetailsVm } from '../models/company-details-vm.model';
import { ContactBaseVm } from '../models/contact-base-vm.model';
import { UsettingsService } from '../../../infra';

const PanelsCheckersKey = 'companypanels';

@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html',
	styleUrls: ['./panels/panels.css', './company-details.component.css'],
})
export class CompanyDetailsComponent implements OnInit {
	domainItem: Observable<Company>;
	company: CompanyDetailsVm = new CompanyDetailsVm();
	note;
	indNoteToDel;
	hiringSign = '';
	hiringGlyph = '';
	returnTo = 'company';

	panelsCheckers: { [key: string]: boolean } = {
		info: false,
		contacts: false,
	};

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _location: Location,
		private _companyRepo: CompanyRepository,
		private _vmSrv: CompanyVmService,
		private _usettings: UsettingsService
	) {
		this.cancelNote();
		this.domainItem = this._route.params.switchMap(params =>
			this._companyRepo.getById(params['id'])
		);
		const ret = this._route.snapshot.queryParams['returnTo'];
		if (ret) {
			this.returnTo = ret;
		}
	}

	ngOnInit() {
		this.domainItem.subscribe(item => {
			if (item) {
				this.company = this._vmSrv.mapToCompanyDetailsVm(item);
				this.setHiringSign();
			}
		});
		this._usettings.get(PanelsCheckersKey).then(p => {
			if (p) {
				this.panelsCheckers = p;
			}
		});
	}

	gotoList(): void {
		this._router.navigate([this.returnTo]);
	}

	gotoEdit(): void {
		this._router.navigate(['company/edit', this.company.id]);
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
		this.company.notes.unshift({
			created: newNote.created,
			text: newNote.text,
		});
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
	async panelToggle(key: string, collapse: boolean) {
		this.panelsCheckers[key] = collapse;
		await this._usettings.set(PanelsCheckersKey, this.panelsCheckers);
	}

	async toggleActive() {
		const dCompany = await this._companyRepo.getById(this.company.id);
		dCompany.toggleActivity();
		await this._companyRepo.store(dCompany);
		this.company.active = dCompany.active;
		this.setHiringSign();
	}

	private setHiringSign() {
		this.hiringSign = this.company.active ? 'deactivate' : 'activate';
		this.hiringGlyph = this.company.active ? 'log-out' : 'log-in';
	}
}
