import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DirectoryService } from '../../directories';
import { Company, Contact, CompanyRepository } from '../core';

@Component({
	selector: 'app-contact-details',
	templateUrl: './contact-details.component.html',
	styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
	domainCompany: Company;
	company;
	contact;
	hiringSign = '';
	hiringGlyph = '';

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _companyRepo: CompanyRepository,
		private _dirSrv: DirectoryService
	) {
		this.company = {};
		this.contact = {};
	}

	ngOnInit() {
		let contactId = '';
		this._route.params
			.switchMap(params => {
				const company = this._companyRepo.getById(params['company_id']);
				contactId = params['contact_id'];
				return company;
			})
			.subscribe(item => {
				this.domainCompany = item;
				this.mapContact(contactId);
			});
	}

	gotoCompany(): void {
		this._router.navigate(['company/details', this.domainCompany._id]);
	}

	gotoEdit(): void {
		this._router.navigate(['contact/edit', this.domainCompany._id, this.contact.id]);
	}

	toggleHiring(): void {
		const contInd = this.domainCompany.contacts
			.findIndex(c => c._id === this.contact.id);
		if (contInd < 0) {
			return;
		}
		this.domainCompany.contacts[contInd].toggleHiring();
		this._companyRepo.store(this.domainCompany)
			.then(() => {
				if (!this.domainCompany.contacts[contInd].active) {
					this._router.navigate(['company/details', this.domainCompany._id]);
				} else {
					this.contact.active = true;
					this.setHiringSign();
				}
			}).catch(e => console.log(e));
	}

	private mapContact(contactId) {
		// TODO: comapny mapping
		const contact = this.domainCompany.contacts
			.find(c => c._id === contactId);
		this.contact.id = contact._id;
		this.contact.firstName = contact.firstName;
		this.contact.lastName = contact.lastName;
		this.contact.jobTitle = contact.jobTitle;
		this.contact.phone = contact.phone;
		this.contact.mobile = contact.mobile;
		this.contact.email = contact.email;
		this.contact.active = contact.active;
		this.setHiringSign();
		this.contact.created = contact.created;
		this.contact.updated = contact.updated;
		this._dirSrv.getDir('jobresponsibility').data
			.subscribe(jrs => {
				this.contact.jobResponsibilities = jrs
					.filter(a => contact.jobResponsibilities.includes(a._id))
					.map(a => a.name)
					.join(', ');
			});
		this._dirSrv.getDir('contentresponsibility').data
			.subscribe(crs => {
				this.contact.buyContents = crs
					.filter(a => contact.buyContents.includes(a._id))
					.map(a => a.name)
					.join(', ');
				this.contact.sellContents = crs
					.filter(a => contact.sellContents.includes(a._id))
					.map(a => a.name)
					.join(', ');
			});
		this._dirSrv.getDir('addinfo').data
			.subscribe(crs => {
				this.contact.addInfos = crs
					.filter(a => contact.addInfos.includes(a._id))
					.map(a => a.name)
					.join(', ');
			});
	}

	private setHiringSign() {
		this.hiringSign = this.contact.active ? 'fire' : 'hire';
		this.hiringGlyph = this.contact.active ? 'log-out' : 'log-in';
	}
}
