import { Component, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { CompanyRepository, Company, Contact } from '../../companies/core';
import { EventRepository, Event } from '../../events/core';
import { DirectoryService, ParticipantCategory } from '../../directories';
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
		let domainParticipants: Participant[];
		let domainEvents: Event[];
		let domainCategories: ParticipantCategory[];
		this.company
			.switchMap(company => {
				this._targetCompanyId = company._id;
				this._targetContacts = company.contacts;
				return this._participantRepo.FindByCompany(company._id);
			})
			.switchMap(participants => {
				domainParticipants = participants;
				return this._eventRepo.findAll();
			})
			.switchMap(events => {
				domainEvents = events;
				return this._dirSrv.getDir('participantcategory').data;
			})
			.switchMap(cats => {
				domainCategories = cats;
				return this._dirSrv.getDir('participantstatus').data;
			})
			.subscribe(stats => {
				this.participants = domainParticipants
					.map(p => {
						const res = new ParticipantListVM();
						res._id = p._id;
						res.eventName = domainEvents.filter(e => e._id === p.event)[0].name;
						res.categoryName = domainCategories.filter(c => c._id === p.category)[0].name;
						res.statusName = stats.filter(s => s._id === p.status)[0].name;
						const contact = this._targetContacts.filter(c => c._id === p.contact)[0];
						res.contactName = contact.name;
						res.contactIsFired = !contact.active;
						return res;
					})
					.sort((a, b) => {
						const eaName = a.eventName.toUpperCase();
						const ebName = b.eventName.toUpperCase();
						if (eaName < ebName) {
							return -1;
						}
						if (eaName > ebName) {
							return 1;
						}
						const caName = a.contactName.toUpperCase();
						const cbName = b.contactName.toUpperCase();
						if (caName < cbName) {
							return -1;
						}
						if (caName > cbName) {
							return 1;
						}
						return 0;
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
