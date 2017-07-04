import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { Company } from '../models/company.model';
import { Contact } from '../models/contact.model';
import { CompanyRepository } from '../repositories/company.repository';
import { DirectoryService, ContentResponsibility, JobResponsibility } from '../../directories';

@Component({
	selector: 'app-contact-edit',
	templateUrl: 'contact-edit.component.html'
})

export class ContactEditComponent implements OnInit {
	company: Company;
	contact: Contact;

	jobResponsibilities: Observable<JobResponsibility[]>;
	contentResponsibilities: Observable<ContentResponsibility[]>;

	contactForm: FormGroup;

	constructor(
		private _companyRepo: CompanyRepository,
		private _route: ActivatedRoute,
		private _router: Router,
		private _location: Location,
		private _fb: FormBuilder,
		private _dirSrv: DirectoryService
	) {
		this.jobResponsibilities = this._dirSrv.getDir('jobresponsibility').data;
		this.contentResponsibilities = this._dirSrv.getDir('contentresponsibility').data;
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
		const contact = new Contact({
			_id: this.contact ? this.contact._id : null,
			firstName: this.contactForm.get('name.first').value.trim(),
			lastName: this.contactForm.get('name.last').value.trim(),
			jobTitle: this.contactForm.get('jobTitle').value.trim(),
			jobResponsibilities: this.contactForm.get('jobResponsibilities').value,
			buyContents: this.contactForm.get('buyContents').value,
			sellContents: this.contactForm.get('sellContents').value,
			phone: this.contactForm.get('phone').value.trim(),
			mobile: this.contactForm.get('mobile').value.trim(),
			email: this.contactForm.get('email').value.trim(),
			active: this.contact ? this.contact.active : true,
			created: this.contact ? this.contact.created : null,
			updated: this.contact ? new Date() : null
		});
		if (this.contact) {
			const ind = this.company.contacts.findIndex(c => c._id === contact._id);
			this.company.contacts[ind] = contact;
		} else {
			this.company.contacts.push(contact);
		}
		this._companyRepo.store(this.company)
			.then(() => this._router.navigate(['contact/details', this.company._id, contact._id]))
			.catch(e => console.log(e));
	}

	onCancel() {
		this._location.back();
	}

	private createForm() {
		this.contactForm = this._fb.group({
			name: this._fb.group({
				first: '',
				last: ''
			}, this.validateName),
			// name: ['', Validators.required],
			jobTitle: '',
			jobResponsibilities: { value: [], disabled: false },
			buyContents: { value: [], disabled: false },
			sellContents: { value: [], disabled: false },
			phone: '',
			mobile: '',
			email: ''
		});
	}

	private validateName(g: FormGroup) {
		return g.get('first').value || g.get('last').value ? null : 'first or last name must be set';
	}

	private initForm() {
		if (!this.contact) {
			return;
		}
		this.contactForm.setValue({
			name: {
				first: this.contact.firstName,
				last: this.contact.lastName
			},
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
