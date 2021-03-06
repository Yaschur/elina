import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Select, Store } from '@ngxs/store';
import { take, map, combineLatest } from 'rxjs/operators';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

import { Company } from '../../companies/core';
import { Event, EventRepository } from '../../events/core';
import { ConfigService, XlsxService } from '../../infra';
import {
	ParticipantStatus,
	ParticipantCategory,
	DirectoryService,
} from '../../directories';

import { SearchBuilder } from '../services/search-builder.service';
import { CompanyListVm } from '../../companies/ui/models/company-list-vm.model';
import { CompanyVmService } from '../../companies/ui/services/company-vm.service';
import { ContactCompanyBaseVm } from '../../companies/ui/models/contact-company-base-vm';
import { SearchCriteriaManager, SearchCriteria } from './criteria.model';
import { SearchState } from '../store/search.state';
import {
	SetFilter,
	SelectCompany,
	SelectContact,
} from '../store/search.actions';
import { SearchStateModel } from '../store/search-state.model';
import { mergeMap } from 'rxjs/operator/mergeMap';

@Component({
	selector: 'app-search-form',
	templateUrl: './search-form.component.html',
	styleUrls: ['./search-form.component.css'],
})
export class SearchFormComponent {
	searchManager: SearchCriteriaManager;
	searchForm: FormGroup;
	searchCriterias: SearchCriteria[];

	allEvents: Observable<Event[]>;
	allPartyStatuses: Observable<ParticipantStatus[]>;
	allPartyCategories: Observable<ParticipantCategory[]>;
	countryOptions: Observable<IMultiSelectOption[]>;
	regionOptions: Observable<IMultiSelectOption[]>;
	activityOptions: Observable<IMultiSelectOption[]>;
	resultMessage: Observable<string>;

	exporting = false;

	noResults: Observable<boolean>;
	companyList: Observable<CompanyListVm[]>;
	contactList: Observable<ContactCompanyBaseVm[]>;

	@Select(SearchState.getResultMode)
	resultMode: Observable<'' | 'company' | 'contact'>;

	private _remoteMode: boolean;
	@Select(SearchState.getFilter) private _filter$: Observable<any>;
	@Select(SearchState.getResults) private _results: Observable<Company[]>;

	constructor(
		private _eventRepo: EventRepository,
		private _dirSrv: DirectoryService,
		private _searchBuilder: SearchBuilder,
		private _companyVm: CompanyVmService,
		private _configSrv: ConfigService,
		private _xlsxSrv: XlsxService,
		private _store: Store
	) {
		this.searchForm = new FormGroup({});
		this.allEvents = Observable.fromPromise(this._eventRepo.findAll());
		this.allPartyStatuses = this._dirSrv.getDir('participantstatus').data;
		this.allPartyCategories = this._dirSrv.getDir('participantcategory').data;
		this.countryOptions = this._dirSrv
			.getDir('country')
			.data.pipe(
				map(cs => cs.map(c => <IMultiSelectOption>{ id: c._id, name: c.name }))
			);
		this.regionOptions = this._dirSrv
			.getDir('region')
			.data.pipe(
				map(cs => cs.map(c => <IMultiSelectOption>{ id: c._id, name: c.name }))
			);
		this.activityOptions = this._dirSrv
			.getDir('activity')
			.data.pipe(
				map(cs => cs.map(c => <IMultiSelectOption>{ id: c._id, name: c.name }))
			);
		this.searchManager = new SearchCriteriaManager();
		this.searchCriterias = [];

		this._filter$.take(1).subscribe(filter => {
			if (!filter || Object.keys(filter).length === 0) {
				filter = JSON.parse(`{"${this.searchManager.retiredKey}": ""}`);
			}
			for (const key in filter) {
				const criteria = this.searchManager.getKeyName(key);
				this.addCriteria(criteria, filter[key]);
			}
		});

		this._configSrv.currentConfig.then(
			config =>
				(this._remoteMode = config.database.nameOrUrl.startsWith('http'))
		);

		this.noResults = this._results.pipe(map(cs => !cs || cs.length === 0));
		this.companyList = this._results.pipe(map(cs => this.getCompanies(cs)));
		this.contactList = this._results.pipe(map(cs => this.getContacts(cs)));

		this.resultMessage = this.resultMode.pipe(
			combineLatest(this.companyList, this.contactList, (mode, cmps, cnts) => {
				if (mode === '') {
					return '';
				}
				return `${mode === 'contact' ? 'contacts' : 'companies'} found: ${
					mode === 'contact' ? cnts.length : cmps.length
				}`;
			})
		);
	}

	async onSubmit(showContact: boolean): Promise<void> {
		const filterSet = {};
		for (const key in this.searchForm.value) {
			const criteria = this.searchManager.getKeyName(key);
			filterSet[criteria] = this.searchForm.value[key];
		}
		this._searchBuilder.reset();
		for (const k in filterSet) {
			const value = filterSet[k];
			switch (k) {
				case this.searchManager.companyNameKey:
					this._searchBuilder.companyNameContains(
						value.trim(),
						this._remoteMode
					);
					break;
				case this.searchManager.contactNameKey:
					this._searchBuilder.contactNameContains(
						value.trim(),
						this._remoteMode
					);
					break;
				case this.searchManager.countriesKey:
					this._searchBuilder.companyInCountries(value);
					break;
				case this.searchManager.participateKey:
					this._searchBuilder.participateIn(value);
					break;
				case this.searchManager.notParticipateKey:
					this._searchBuilder.notParticipateIn(value);
					break;
				case this.searchManager.createdKey:
					this._searchBuilder.createdBetween(value);
					break;
				case this.searchManager.regionsKey:
					this._searchBuilder.companyInRegions(value);
					break;
				case this.searchManager.activitiesKey:
					this._searchBuilder.companyActivitiesIn(value);
					break;
				case this.searchManager.retiredKey:
					this._searchBuilder.companyRetired(value);
					break;
			}
		}
		const filterCompiled = await this._searchBuilder.build();
		this._store.dispatch(
			new SetFilter({
				set: filterSet,
				compiled: filterCompiled,
				mode: showContact ? 'contact' : 'company',
			})
		);
	}

	removeCriteria(key: string) {
		if (this.searchManager.inUse.length < 2) {
			return;
		}
		this.searchManager.removeCriteria(key);
		this.searchForm.removeControl(key);
		this.searchCriterias = this.searchManager.getAllowedCriterias();
	}
	addCriteria(keyName: string, value?: any) {
		const key = this.searchManager.useCriteria(keyName);
		if (
			keyName === this.searchManager.participateKey ||
			keyName === this.searchManager.notParticipateKey
		) {
			this.searchForm.addControl(
				key,
				new FormGroup({
					event: new FormControl(''),
					status: new FormControl(''),
					category: new FormControl(''),
				})
			);
		} else if (keyName === this.searchManager.createdKey) {
			this.searchForm.addControl(
				key,
				new FormGroup({
					from: new FormControl(''),
					to: new FormControl(''),
				})
			);
		} else if (
			keyName === this.searchManager.retiredKey ||
			keyName === this.searchManager.companyNameKey ||
			keyName === this.searchManager.contactNameKey
		) {
			this.searchForm.addControl(key, new FormControl(''));
		} else {
			this.searchForm.addControl(key, new FormControl(null));
		}
		if (value) {
			this.searchForm.controls[key].setValue(value);
		}
		this.searchCriterias = this.searchManager.getAllowedCriterias();
	}

	async onXlsx() {
		const mode = this._store.selectSnapshot(SearchState.getResultMode);
		const res = this._store.selectSnapshot(SearchState.getResults);
		if (mode === 'company') {
			this.exporting = true;
			await this._xlsxSrv.exportToXlsx(
				res.map(c => this._companyVm.mapToCompanyDetailsVm(c)),
				'search_companies.xlsx',
				'Companies',
				[
					'name',
					'country',
					'city',
					'description',
					'activities',
					'phone',
					'website',
					'isNew',
					'created',
					'updated',
				]
			);
			this.exporting = false;
			return;
		}
		if (mode === 'contact') {
			this.exporting = true;
			await this._xlsxSrv.exportToXlsx(
				[]
					.concat(
						...res.map(c => this._companyVm.flatMapToContactCompanyDetailsVm(c))
					)
					.sort(this._companyVm.sortContacts),
				'search_contacts.xlsx',
				'Contacts',
				[
					'firstName',
					'lastName',
					'jobTitle',
					'companyName',
					'phone',
					'mobile',
					'email',
					'jobResponsibilities',
					'buyContents',
					'sellContents',
					'addInfos',
					'active',
					'isNew',
					'created',
					'updated',
				]
			);
			this.exporting = false;
		}
	}

	gotoCompanyProfile(companyId: string) {
		this._store.dispatch(new SelectCompany(companyId));
	}

	gotoContactProfile(companyId: string, contactId: string) {
		this._store.dispatch(
			new SelectContact({ companyId: companyId, contactId: contactId })
		);
	}

	private getCompanies(cs: Company[]): CompanyListVm[] {
		return cs.map(c => this._companyVm.mapToCompanyListVm(c));
	}
	private getContacts(cs: Company[]): ContactCompanyBaseVm[] {
		return []
			.concat(...cs.map(c => this._companyVm.flatMapToContactCompanyBaseVm(c)))
			.sort(this._companyVm.sortContacts);
	}
}
