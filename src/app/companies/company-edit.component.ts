import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DirectoryService } from '../directories/services/directory.service';
import { Country } from '../directories/models/country.model';

@Component({
	moduleId: module.id,
	selector: 'app-company-edit',
	templateUrl: 'company-edit.component.html'
})
export class CompanyEditComponent implements OnInit {
	// company:
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
	}
}
