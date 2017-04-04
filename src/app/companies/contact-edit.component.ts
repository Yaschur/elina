import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Company } from './models/company.model';
import { Contact } from './models/contact.model';
import { CompanyRepository } from './repositories/company.repository';
import { DirectoryService } from '../directories/services/directory.service';

@Component({
	moduleId: module.id,
	selector: 'app-contact-edit',
	templateUrl: 'contact-edit.component.html'
})

export class ContactEditComponent implements OnInit {
	company: Company;
	contact: Contact;

	contactForm: FormGroup;
	constructor(
		private _companyRepo: CompanyRepository,
		private _route: ActivatedRoute,
		private _fb: FormBuilder,
		private _dirSrv: DirectoryService
	) {
		// this.countries = this._dirSrv.getDir('country').data;
		// this.activities = this._dirSrv.getDir('activity').data;
		this.createForm();
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
				this.company = item;
				this.contact = item.contacts
					.find(c => c._id === contactId);
				this.initForm();
			});
	}

	onSubmit() {
		// const company = new Company({
		// 	_id: this.company ? this.company._id : null,
		// 	name: this.companyForm.get('name').value.trim(),
		// 	description: this.companyForm.get('description').value.trim(),
		// 	country: this.companyForm.get('country').value,
		// 	city: this.companyForm.get('city').value.trim(),
		// 	activities: this.companyForm.get('activities').value,
		// 	phone: this.companyForm.get('phone').value.trim(),
		// 	website: this.companyForm.get('website').value.trim(),
		// 	created: this.company ? this.company.created : null,
		// 	updated: this.company ? new Date() : null,
		// 	notes: this.company ? this.company.notes : [],
		// 	contacts: this.company ? this.company.contacts : []
		// });
		// this._companyRepo.store(company)
		// 	.then(() => console.log('saved, created: ' + company.created + ', updated: ' + company.updated))
		// 	.catch(e => console.log(e));
	}

	private createForm() {
		this.contactForm = this._fb.group({
			name: ['', Validators.required],
			jobTitle: '',
			jobResponsibilities: '',
			buyContents: { value: [], disabled: false },
			sellContents: { value: [], disabled: false },
			phone: '',
			mobile: '',
			email: ''
		});
	}

	private initForm() {
		if (!this.contact) {
			return;
		}
		this.contactForm.setValue({
			name: this.contact.name,
			jobTitle: this.contact.jobTitle,
			jobResponsibilities: this.contact.jobResponsibilities,
			buyContents: this.contact.buyContents,
			sellContents: this.contact.sellContents,
			phone: this.contact.phone,
			mobile: this.contact.mobile,
			email: this.contact.email
		});
	}
}
