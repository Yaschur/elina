import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DirectoryService, Country } from '../../../directories';
import { XlsxService } from '../../../infra';
import { Company, CompanyRepository } from '../../core';

import 'rxjs/add/observable/fromPromise';

const NEWPERIOD = 365 * 24 * 60 * 60 * 1000;

@Component({
	selector: 'app-company-list',
	templateUrl: 'company-list.component.html'
})
export class CompanyListComponent implements OnInit {
	companies: Observable<CompanyListVm[]>;
	search = '';

	constructor(
		private _companyRepo: CompanyRepository,
		private _dirSrv: DirectoryService,
		private _xlsxSrv: XlsxService,
		private _router: Router,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this.companies = this._route.paramMap
			.switchMap(params => {
				if (params.has('search')) {
					this.search = params.get('search');
				}
				return this._dirSrv.getDir('country').data;
			})
			.switchMap(async countries => {
				const companies = await (this.search ? this._companyRepo.findByName(this.search) : this._companyRepo.findAll());
				return companies.map(c => new CompanyListVm(c, countries));
			});
	}

	gotoNew(): void {
		this._router.navigate(['company/edit', '__new__']);
	}

	gotoDetails(id): void {
		this._router.navigate(['company/details', id]);
	}

	onSearch(term: string) {
		this.search = term.trim();
		const navArray: Array<any> = ['company'];
		if (this.search) {
			navArray.push({ 'search': this.search });
		}
		this._router.navigate(navArray);
	}

	async onXlsx() {
		const companies = await (this.search ? this._companyRepo.findByName(this.search) : this._companyRepo.findAll());
		this._xlsxSrv.exportToXlsx(companies, 'companies.xlsx', 'Companies Sheet');
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
		const country = countries
			.find(c => c._id === company.country);
		this.location = country ? country.name : '';
		if (company.city) {
			this.location += ' (' + company.city + ')';
		}
		this.activitiesNum = company.activities.length;
		this.contactsNum = company.contacts
			.filter(c => c.active)
			.length;
		this.isNew = new Date().getTime() - new Date(company.created).getTime() < NEWPERIOD;
	}
}
