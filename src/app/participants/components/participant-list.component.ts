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

	participants: ParticipantListVM[];

	private _targetCompanyId: string;
	private _targetContacts: Contact[];

	constructor(
		private _participantRepo: ParticipantRepository,
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
		private _router: Router,
		private _dirSrv: DirectoryService
	) {
		this.participants = [];
	}

	ngOnInit() {
		this.company
			.subscribe(async company => {
				this._targetCompanyId = company._id;
				this._targetContacts = company.contacts;
				const categories = await this._dirSrv.getDir('participantcategory').data.toPromise();
				const statuses = await this._dirSrv.getDir('participantstatus').data.toPromise();
				const events = await this._eventRepo.findAll();
				this.participants = (await this._participantRepo.FindByCompany(company._id))
					.map(p => <ParticipantListVM>{
						_id: p._id,
						eventName: events.filter(e => e._id === p.event)[0].name,
						categoryName: categories.filter(c => c._id === p.category)[0].name,
						contactName: this._targetContacts.filter(c => c._id === p.contact)[0].name,
						contactIsFired: !(this._targetContacts.filter(c => c._id === p.contact)[0].active),
						statusName: statuses.filter(c => c._id === p.status)[0].name
					});
			});
	}

	addParticipant(): void {
		this._router.navigate(['participant/add', { company_id: this._targetCompanyId }]);
	}
}

interface ParticipantListVM {
	_id: string;
	eventName: string;
	contactName: string;
	contactIsFired: boolean;
	categoryName: string;
	statusName: string;
}
