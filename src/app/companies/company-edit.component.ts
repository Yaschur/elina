import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	moduleId: module.id,
	selector: 'app-company-edit',
	templateUrl: 'company-edit.component.html'
})
export class CompanyEditComponent implements OnInit {
	// company:
	name = new FormControl();

	constructor() { }

	ngOnInit() { }
}
