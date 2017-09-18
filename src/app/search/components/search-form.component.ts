import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-search-form',
	templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnInit {

	searchForm: FormGroup;

	hasCompanyNameTerm: boolean;

	constructor() {
		this.hasCompanyNameTerm = true;
		this.searchForm = new FormGroup({});
	}

	ngOnInit() {
		// if (this.hasCompanyNameTerm) {
		// 	this.searchForm.addControl(
		// 		''
		// 	)
		// }
	}

}
