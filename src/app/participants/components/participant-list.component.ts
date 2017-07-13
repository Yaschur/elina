import { Component, Input, Output, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { CompanyRepository, Company } from '../../companies/core';
import { EventRepository, Event } from '../../events/core';
import { Participant } from '../models/participant.model';

@Component({
	selector: 'app-participant-list',
	templateUrl: 'participant-list.component.html'
})

export class ParticipantListComponent implements OnInit {

	@Input() company: Observable<Company>

	// events: Observable<Event[]>;
	participants: Observable<Participant>;

	constructor(
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
	) { }

	ngOnInit() { }
}
