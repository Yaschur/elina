import { Component, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { CompanyRepository, Company } from '../../companies/core';
import { EventRepository, Event } from '../../events/core';
import { Participant } from '../models/participant.model';
import { ParticipantRepository } from '../repositories/participant.repository';

@Component({
	selector: 'app-participant-list',
	templateUrl: 'participant-list.component.html'
})

export class ParticipantListComponent implements OnInit {

	@Input() company: Observable<Company>

	participants: Observable<Participant[]>;

	private targetCompanyId: string;

	constructor(
		private _participantRepo: ParticipantRepository,
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
		private _router: Router
	) { }

	ngOnInit() {
		this.participants = this.company
			.switchMap(company => {
				this.targetCompanyId = company._id;
				return this._participantRepo.FindByCompany(company._id)
			});
	}

	addParticipant(): void {
		this._router.navigate(['participant/add', { company_id: this.targetCompanyId }]);
	}
}
