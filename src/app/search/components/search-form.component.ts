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
import { SearchCriteriaManager, SearchCriteria } from './criteria.model';

@Component({
	selector: 'app-search-form',
	templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnInit {

	searchManager: SearchCriteriaManager;
	searchForm: FormGroup;
	searchCriterias: SearchCriteria[];

	allEvents: Observable<Event[]>;

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
		this.companies = [];
		this.contacts = [];
		this.searchForm = new FormGroup({});
		this.allEvents = Observable.fromPromise(
			this._eventRepo.findAll()
		);
		this.searchManager = new SearchCriteriaManager();
		this.searchCriterias = [];
	}

	ngOnInit() {
		this._configSrv.currentConfig
			.then(config => this._remoteMode = config.database.nameOrUrl.startsWith('http'));
		this.addCriteria(this.searchManager.companyNameKey);
	}

	async onSubmit(showContact: boolean): Promise<void> {
		this._searchBuilder.reset();
		this.searchManager.inUse.forEach(k => {
			const value = this.searchForm.get(k).value;
			switch (this.searchManager.getKeyName(k)) {
				case this.searchManager.companyNameKey:
					this._searchBuilder.companyNameContains(value.trim(), this._remoteMode);
					break;
				case this.searchManager.contactNameKey:
					this._searchBuilder.contactNameContains(value.trim(), this._remoteMode);
					break;
				case this.searchManager.participateKey:
					this._searchBuilder.participateIn(value);
					break;
			}
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

	removeCriteria(key: string) {
		if (this.searchManager.inUse.length < 2) {
			return;
		}
		this.searchManager.removeCriteria(key);
		this.searchForm.removeControl(key);
		this.searchCriterias = this.searchManager.getAllowedCriterias();
	}
	addCriteria(keyName: string) {
		const key = this.searchManager.useCriteria(keyName);
		this.searchForm.addControl(key, new FormControl(''));
		this.searchCriterias = this.searchManager.getAllowedCriterias();
	}
}
