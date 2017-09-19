import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { CompanyRepository } from '../../companies/core';
import { SearchBuilder } from '../services/search-builder.service';
import { CompanyListVm } from '../../companies/ui/models/company-list-vm.model';
import { CompanyVmService } from '../../companies/ui/services/company-vm.service';
import { ContactCompanyBaseVm } from '../../companies/ui/models/contact-company-base-vm';

@Component({
	selector: 'app-search-form',
	templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnInit {

	searchForm: FormGroup;

	hasCompanyNameTerm: boolean;
	hasContactNameTerm: boolean;
	participationCount: number;

	companies: CompanyListVm[];
	contacts: ContactCompanyBaseVm[];

	constructor(
		private _companyRepo: CompanyRepository,
		private _searchBuilder: SearchBuilder,
		private _companyVm: CompanyVmService
	) {
		this.hasCompanyNameTerm = true;
		this.hasContactNameTerm = true;
		this.participationCount = 0;
		this.companies = [];
		this.contacts = [];
		this.searchForm = new FormGroup({});
	}

	ngOnInit() {
		if (this.hasCompanyNameTerm) {
			this.searchForm.addControl(
				'companyName',
				new FormControl('')
			);
		}
		if (this.hasContactNameTerm) {
			this.searchForm.addControl(
				'contactName',
				new FormControl('')
			);
		}
	}

	async onSubmit(showContact: boolean): Promise<void> {
		this._searchBuilder.reset();
		if (this.hasCompanyNameTerm) {
			const companyNameTerm = this.searchForm.get('companyName').value.trim();
			this._searchBuilder.companyNameContains(companyNameTerm);
		}
		if (this.hasCompanyNameTerm) {
			const contactNameTerm = this.searchForm.get('contactName').value.trim();
			this._searchBuilder.contactNameContains(contactNameTerm);
		}
		const filter = this._searchBuilder.build();
		const founded = await this._companyRepo.findByFilter(filter);
		if (showContact) {
			this.companies = [];
			this.contacts = []
				.concat(...founded.map(c => this._companyVm.flatMapToContactCompanyBaseVm(c)))
				.sort(this._companyVm.sortContacts);
		} else {
			this.contacts = [];
			this.companies = founded
				.map(c => this._companyVm.mapToCompanyListVm(c));
		}
	}
}
