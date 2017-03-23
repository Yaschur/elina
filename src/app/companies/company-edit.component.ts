import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Company } from './models/company.model';
import { DirectoryService } from '../directories/services/directory.service';
import { Country } from '../directories/models/country.model';

@Component({
	moduleId: module.id,
	selector: 'app-company-edit',
	templateUrl: 'company-edit.component.html'
})
export class CompanyEditComponent implements OnInit {
	company: Company;

	countries: Country[];

	companyForm: FormGroup;

	constructor(private _fb: FormBuilder, private _dirSrv: DirectoryService) {
		this.countries = [];
		this.companyForm = this._fb.group({
			name: ['', Validators.required],
			country: '',
			city: ''
		});
	}

	ngOnInit() {
		this._dirSrv.getDir('country').data
			.subscribe(items => this.countries = items);
		this.company = new Company({_id: 'f23111', name: 'First and Fast', country: 'RUS'});
		if (this.company) {
			this.companyForm.setValue({
				name: this.company.name || '',
				country: this.company.country || '',
				city: this.company.city || ''
			});
		}
	}
}
