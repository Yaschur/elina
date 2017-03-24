import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Company } from './models/company.model';
import { CompanyRepository } from './repositories/company.repository';

import 'rxjs/add/observable/fromPromise';

@Component({
	moduleId: module.id,
	selector: 'app-company-list',
	templateUrl: 'company-list.component.html'
})
export class CompanyListComponent implements OnInit {
	companies: Observable<Company[]>;

	constructor(private _companyRepo: CompanyRepository, private _router: Router) { }

	ngOnInit() {
		this.companies = Observable.fromPromise(this._companyRepo.findAll());
	}

	gotoEdit(id): void {
		this._router.navigate(['company', id]);
	}
}
