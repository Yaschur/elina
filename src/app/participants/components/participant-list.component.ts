import { Component, OnInit } from '@angular/core';

import { CompanyRepository } from '../../companies/core';
import { EventRepository } from '../../events/core';

@Component({
	selector: 'app-participant-list',
	templateUrl: 'participant-list.component.html'
})

export class ParticipantListComponent implements OnInit {
	constructor(
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
	) { }

	ngOnInit() { }
}
