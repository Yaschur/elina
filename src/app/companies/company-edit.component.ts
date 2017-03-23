import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	moduleId: module.id,
	selector: 'app-company-edit',
	templateUrl: 'company-edit.component.html'
})
export class CompanyEditComponent implements OnInit {
	// company:
	companyForm: FormGroup;

	constructor(private _fb: FormBuilder) {
		this.companyForm = this._fb.group({
			name: ['', Validators.required]
		});
	}

	ngOnInit() { }
}
