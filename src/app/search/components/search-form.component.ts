import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { CompanyRepository } from '../../companies/core';
import { SearchBuilder } from '../services/search-builder.service';
import { CompanyListVm } from '../../companies/ui/models/company-list-vm.model';
import { CompanyVmService } from '../../companies/ui/services/company-vm.service';

@Component({
	selector: 'app-search-form',
	templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnInit {

	searchForm: FormGroup;

	hasCompanyNameTerm: boolean;
	participationCount: number;

	companies: CompanyListVm[];

	constructor(
		private _companyRepo: CompanyRepository,
		private _searchBuilder: SearchBuilder,
		private _companyVm: CompanyVmService
	) {
		this.hasCompanyNameTerm = true;
		this.participationCount = 0;
		this.companies = [];
		this.searchForm = new FormGroup({});
	}

	ngOnInit() {
		if (this.hasCompanyNameTerm) {
			this.searchForm.addControl(
				'companyName',
				new FormControl('')
			);
		}
	}

	async onSubmit(): Promise<void> {
		this._searchBuilder.reset();
		if (this.hasCompanyNameTerm) {
			const companyNameTerm = this.searchForm.get('companyName').value.trim();
			this._searchBuilder.searchByName(companyNameTerm);
			this.companies = (await this._companyRepo.findByFilter(this._searchBuilder.build()))
				.map(c => this._companyVm.mapToCompanyListVm(c));
		}
	}
}
