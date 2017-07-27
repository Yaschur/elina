import { Component, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { CompanyRepository, Company, Contact } from '../../companies/core';
import { EventRepository, Event } from '../../events/core';
import { DirectoryService } from '../../directories';
import { Participant } from '../models/participant.model';
import { ParticipantRepository } from '../repositories/participant.repository';

@Component({
	selector: 'app-participant-list',
	templateUrl: 'participant-list.component.html'
})

export class ParticipantListComponent implements OnInit {

	@Input() company: Observable<Company>;

	participants: Observable<ParticipantListVM[]>;

	private _targetCompanyId: string;
	private _targetContacts: Contact[];

	constructor(
		private _participantRepo: ParticipantRepository,
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
		private _router: Router,
		private _dirSrv: DirectoryService
	) { }

	ngOnInit() {
		participants = this.company
			.switchMap(company => {
				this._targetCompanyId = company._id;
				this._targetContacts = company.contacts;
				return this._participantRepo.FindByCompany(company._id);
			})
			.switchMap(participants => {
				const categories = this._dirSrv.getDir('participantcategory').data.
			});

	}

	addParticipant(): void {
		this._router.navigate(['participant/add', { company_id: this._targetCompanyId }]);
	}
}

class ParticipantListVM {
	_id: string;
	eventName: string;
	contactName: string;
	contactIsFired: boolean;
	categoryName: string;
	statusName: string;
}
