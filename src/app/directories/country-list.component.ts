import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Company } from './models/company.model';

import { CompanyRepository } from './repositories/company.repository';

@Component({
	moduleId: module.id,
	selector: 'app-company-list',
	templateUrl: 'companies.component.html',
	providers: [CompanyRepository]
})
export class CompaniesComponent implements OnInit {
	constructor(
		private _repo: CompanyRepository,
		private _router: Router
	) { }

	items: Company[] = [];
	term: string = '';

	ngOnInit() {
		this.findCompanies();
	}

	generate100Companies() {
		for (let i = 0; i < 1000; i++) {
			const newCompany = new Company();
			newCompany.name = 'Company ' + i;
			newCompany.country = 'ENG';
			newCompany.email = '';
			newCompany.phone = '123 45 6' + (i + 1);
			//console.log(newCompany);
			this._repo.store(newCompany)
				.catch((e) => console.log(e));
		}
		this.findCompanies();
	}
	findCompanies() {
		this._repo.findAll()
			.then(res => this.items = res);
	}

	gotoEdit(id: string = ''): void {
		this._router.navigate(['/company/edit', id]);
	}

	search() {
		if (this.term) {
			this._repo.findAll(this.term)
				.then(res => this.items = res);
		}
	}
	resetSearch() {
		this.term = '';
		this.findCompanies();
	}
}
