import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Company } from './models/company.model';
import { CompanyRepository } from './repositories/company.repository';
import { DirectoryService } from '../directories/services/directory.service';

@Component({
	moduleId: module.id,
	selector: 'app-company-details',
	templateUrl: 'company-details.component.html'
})

export class CompanyDetailsComponent implements OnInit {
	company;
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _companyRepo: CompanyRepository,
		private _dirSrv: DirectoryService
	) {
		this.company = {};
	}

	ngOnInit() {
		this._route.params
			.switchMap(params => this._companyRepo.getById(params['id']))
			.subscribe(item => this.mapCompany(item));
	}

	gotoEdit(id): void {
		this._router.navigate(['company/edit', id]);
	}

	private mapCompany(company: Company) {
		this.company.id = company._id;
		this.company.name = company.name;
		this.company.description = company.description;
		// this.company.country =
		this.company.city = company.city;
		// this.company.activities =
		this.company.website = company.website;
		this.company.phone = company.phone;
		this.company.created = company.created;
		this.company.updated = company.updated;
		// this.company.notes =
		// this.comapny.contacts =
	}
}
