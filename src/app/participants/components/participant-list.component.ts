import { Component, Input, Output, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { CompanyRepository, Company } from '../../companies/core';
import { EventRepository, Event } from '../../events/core';

@Component({
	selector: 'app-participant-list',
	templateUrl: 'participant-list.component.html'
})

export class ParticipantListComponent implements OnInit {

	private _anchorCompany: Company;

	@Input()
	set company(company: Company) {
		this.events = Observable.fromPromise(this._eventRepo.findAll());
		this._anchorCompany = company;
	}
	get company() {
		return this._anchorCompany;
	}

	events: Observable<Event[]>;

	constructor(
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
	) { }

	ngOnInit() { }
}
