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
			.subscribe(company => {
				this._targetCompanyId = company._id;
				this._targetContacts = company.contacts;
				const categoriesO = this._dirSrv.getDir('participantcategory').data;
				const statusesO = this._dirSrv.getDir('participantstatus').data;
				const eventsP = this._eventRepo.findAll();
				this._participantRepo.FindByCompany(company._id)
					.then(participants => {
						this.participants = participants.map(p => {
							const res = new ParticipantListVM();
							res._id = p._id;
							eventsP
								.then(events => res.eventName = events.filter(e => e._id === p.event)[0].name);
							categoriesO
								.subscribe(categories => res.categoryName = categories.filter(c => c._id === p.category)[0].name);
							statusesO
								.subscribe(statuses => res.statusName = statuses.filter(s => s._id === p.status)[0].name);
							const contact = this._targetContacts.filter(c => c._id === p.contact)[0];
							res.contactName = contact.name;
							res.contactIsFired = !contact.active;
							return res;
						});
						// .sort((a, b) => {
						// 	if (a.eventName > b.eventName) {
						// 		return 1;
						// 	}
						// 	if (a.eventName < b.eventName) {
						// 		return -1;
						// 	}
						// 	if (a.contactName > b.contactName) {
						// 		return 1;
						// 	}
						// 	if (a.contactName < b.contactName) {
						// 		return -1;
						// 	}
						// 	return 0;
						// });
					});
			});
	}

	addParticipant(): void {
		this._router.navigate(['participant/add', { company_id: this._targetCompanyId }]);
	}

	editParticipant(id: string): void {
		this._router.navigate(['participant/edit', id]);
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
