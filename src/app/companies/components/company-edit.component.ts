import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { DirectoryService, Country, Activity } from '../../directories';
import { Company, CompanyRepository } from '../core';

@Component({
	selector: 'app-company-edit',
	templateUrl: 'company-edit.component.html'
})
export class CompanyEditComponent implements OnInit {
	company: Company;

	countries: Observable<Country[]>;
	activities: Observable<Activity[]>;

	companyForm: FormGroup;

	constructor(
		private _companyRepo: CompanyRepository,
		private _route: ActivatedRoute,
		private _router: Router,
		private _location: Location,
		private _fb: FormBuilder,
		private _dirSrv: DirectoryService
	) {
		this.countries = this._dirSrv.getDir('country').data;
		this.activities = this._dirSrv.getDir('activity').data;
		this.createForm();
	}

	ngOnInit() {
		this._route.params
			.switchMap(params => this._companyRepo.getById(params['id']))
			.subscribe(item => {
				this.company = item;
				this.initForm();
			});
	}

	onSubmit() {
		const company = new Company({
			_id: this.company ? this.company._id : null,
			name: this.companyForm.get('name').value.trim(),
			description: this.companyForm.get('description').value.trim(),
			country: this.companyForm.get('country').value,
			city: this.companyForm.get('city').value.trim(),
			activities: this.companyForm.get('activities').value,
			phone: this.companyForm.get('phone').value.trim(),
			website: this.companyForm.get('website').value.trim(),
			created: this.company ? this.company.created : null,
			updated: this.company ? new Date() : null,
			notes: this.company ? this.company.notes : [],
			contacts: this.company ? this.company.contacts : []
		});
		this._companyRepo.store(company)
			.then(() => this._router.navigate(['company/details', company._id]))
			.catch(e => console.log(e));
	}

	onCancel() {
		this._location.back();
	}

	private createForm() {
		this.companyForm = this._fb.group({
			name: ['', Validators.required],
			description: '',
			country: '',
			city: '',
			activities: { value: [], disabled: false },
			phone: '',
			website: ''
		});
	}

	private initForm() {
		if (!this.company) {
			return;
		}
		this.companyForm.setValue({
			name: this.company.name,
			description: this.company.description,
			country: this.company.country,
			city: this.company.city,
			activities: this.company.activities,
			phone: this.company.phone,
			website: this.company.website
		});
	}
}
