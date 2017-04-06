import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Company } from './models/company.model';
import { Country } from '../directories/models/country.model';
import { DirectoryService } from '../directories/services/directory.service';
import { CompanyRepository } from './repositories/company.repository';

import 'rxjs/add/observable/fromPromise';

const NEWPERIOD = 365 * 60 * 60 * 1000;

@Component({
	moduleId: module.id,
	selector: 'app-company-list',
	templateUrl: 'company-list.component.html'
})
export class CompanyListComponent implements OnInit {
	companies: Observable<CompanyListVm[]>;

	constructor(
		private _companyRepo: CompanyRepository,
		private _dirSrv: DirectoryService,
		private _router: Router) { }

	ngOnInit() {
		this.companies = this._dirSrv.getDir('country').data
			.switchMap(async countries => {
				const companies = await this._companyRepo.findAll();
				return companies.map(c => new CompanyListVm(c, countries));
			});
	}

	gotoNew(): void {
		this._router.navigate(['company/edit', '__new__']);
	}

	gotoDetails(id): void {
		this._router.navigate(['company/details', id]);
	}
}

class CompanyListVm {
	id: string;
	name: string;
	// description: string;
	location: string;
	// country: string;
	// city: string;
	activitiesNum: number;
	// activities: string[];
	// phone: string;
	// website: string;
	contactsNum: number;
	isNew: boolean;
	// created: Date;
	// updated: Date;

	constructor(company: Company, countries: Country[]) {
		this.id = company._id;
		this.name = company.name;
		const c = countries
			.find(c => c._id == company.country);
		this.location = c ? c.name : '';
		if (company.city) {
			this.location += ' (' + company.city + ')'
		}
		this.activitiesNum = company.activities.length;
		this.contactsNum = company.contacts.length;
		this.isNew = new Date().getTime() - new Date(company.created).getTime() < NEWPERIOD;
	}
}
