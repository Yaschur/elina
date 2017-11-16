import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { CompanyRepository } from '../../companies/core';
import { Event, EventRepository } from '../../events/core';
import { ConfigService } from '../../infra/index';

import { SearchBuilder } from '../services/search-builder.service';
import { CompanyListVm } from '../../companies/ui/models/company-list-vm.model';
import { CompanyVmService } from '../../companies/ui/services/company-vm.service';
import { ContactCompanyBaseVm } from '../../companies/ui/models/contact-company-base-vm';
import { SearchCriteriaManager } from './criteria.model';

@Component({
	selector: 'app-search-form',
	templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnInit {

	searchManager: SearchCriteriaManager;
	searchForm: FormGroup;

	allEvents: Observable<Event[]>;

	hasCompanyNameTerm: boolean;
	hasContactNameTerm: boolean;
	participations: string[];
	private _remoteMode: boolean;

	companies: CompanyListVm[];
	contacts: ContactCompanyBaseVm[];

	constructor(
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
		private _searchBuilder: SearchBuilder,
		private _companyVm: CompanyVmService,
		private _configSrv: ConfigService
	) {
		this.hasCompanyNameTerm = true;
		this.hasContactNameTerm = false;
		this.participations = [];
		this.companies = [];
		this.contacts = [];
		this.searchForm = new FormGroup({});
		this.allEvents = Observable.fromPromise(
			this._eventRepo.findAll()
		);
		this.searchManager = new SearchCriteriaManager();
	}

	ngOnInit() {
		this._configSrv.currentConfig
			.then(config => this._remoteMode = config.database.nameOrUrl.startsWith('http'));
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
		this.participations.forEach(p => this.searchForm.addControl(p, new FormControl('')));
		this.searchManager.useCriteria('companyName');
	}

	async onSubmit(showContact: boolean): Promise<void> {
		this._searchBuilder.reset();
		if (this.hasCompanyNameTerm) {
			const companyNameTerm = this.searchForm.get('companyName').value.trim();
			this._searchBuilder.companyNameContains(companyNameTerm, this._remoteMode);
		}
		if (this.hasContactNameTerm) {
			const contactNameTerm = this.searchForm.get('contactName').value.trim();
			this._searchBuilder.contactNameContains(contactNameTerm, this._remoteMode);
		}
		this.participations.forEach(p => {
			const eventChosen = this.searchForm.get(p).value;
			this._searchBuilder.participateIn(eventChosen);
		});
		const filter = await this._searchBuilder.build();
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
