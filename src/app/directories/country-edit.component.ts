import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Company } from './models/company.model';

import { CompanyRepository } from './repositories/company.repository';

@Component({
	moduleId: module.id,
	selector: 'app-company-edit',
	templateUrl: 'company-edit.component.html',
	providers: [CompanyRepository]
})
export class CompanyEditComponent implements OnInit {
	company: Company = new Company();

	constructor(
		private _repo: CompanyRepository,
		private _route: ActivatedRoute,
		private _location: Location
	) { }

	ngOnInit() {
		this._route.params
			.switchMap((params: Params) => {
				//console.log(params['id']);
				let id = params['id'];
				if (!id) {
					return null;
				}
				let res = this._repo.getById(params['id']);
				//console.log(res);
				return res;
			})
			.subscribe(company => {
				console.log(company);
				if (company != null) {
					this.company = company;
				}
			});
	}

	save(): void {
		if (!this.company.name) {
			this.company.name = '<No name>';
		}
		this._repo.store(this.company);
		this.gotoBack();
	}

	gotoBack(): void {
		this._location.back();
	}
}
