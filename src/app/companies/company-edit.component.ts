import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Company } from './models/company.model';
import { DirectoryService } from '../directories/services/directory.service';
import { Country } from '../directories/models/country.model';
import { Activity } from '../directories/models/activity.model';
import { CompanyRepository } from './repositories/company.repository';

@Component({
	moduleId: module.id,
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

	private createForm() {
		this.companyForm = this._fb.group({
			name: ['', Validators.required],
			description: '',
			country: '',
			city: '',
			// activities: [],
			phone: '',
			website: ''
			// created: {value: 'new', disabled: true}
			// updated: Date
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
			phone: this.company.phone,
			website: this.company.website
		});
	}
}
