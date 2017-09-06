import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CompanyVmService } from '../services/company-vm.service';
import { Company, Contact, CompanyRepository } from '../../core';
import { ContactDetailVm } from '../models/contact-detail-vm.model';

@Component({
	selector: 'app-contact-details',
	templateUrl: './contact-details.component.html',
	styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
	domainCompany: Company;
	contact: ContactDetailVm = new ContactDetailVm();
	hiringSign = '';
	hiringGlyph = '';

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _companyRepo: CompanyRepository,
		private _vmSrv: CompanyVmService
	) { }

	ngOnInit() {
		this._route.params
			.subscribe(async params => {
				this.domainCompany = await this._companyRepo.getById(params['company_id']);
				const dContact = this.domainCompany.getContactById(params['contact_id']);
				this.contact = this._vmSrv.mapToContactDetailVm(dContact);
				this.setHiringSign();
			});
	}

	gotoCompany(): void {
		this._router.navigate(['company/details', this.domainCompany._id]);
	}

	gotoEdit(): void {
		this._router.navigate(['contact/edit', this.domainCompany._id, this.contact.id]);
	}

	async toggleHiring() {
		const contact = this.domainCompany.getContactById(this.contact.id);
		contact.toggleHiring();
		await this._companyRepo.store(this.domainCompany);
		if (!contact.active) {
			this._router.navigate(['company/details', this.domainCompany._id]);
		} else {
			this.contact.active = true;
			this.setHiringSign();
		}
	}

	private setHiringSign() {
		this.hiringSign = this.contact.active ? 'fire' : 'hire';
		this.hiringGlyph = this.contact.active ? 'log-out' : 'log-in';
	}
}
