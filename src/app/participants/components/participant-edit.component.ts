import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Company, CompanyRepository, Contact } from '../../companies/core';
import { Event, EventRepository } from '../../events/core';
import { Participant } from '../models/participant.model';
import { ParticipantRepository } from '../repositories/participant.repository';

// import 'rxjs/add/operator/map';

@Component({
	selector: 'app-participant-edit',
	templateUrl: 'participant-edit.component.html'
})

export class ParticipantEditComponent implements OnInit {
	participantForm: FormGroup;

	company: Company;
	participant: Participant;
	events: Event[];
	participants: Participant[];

	constructor(
		private _route: ActivatedRoute,
		private _fb: FormBuilder,
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
		private _partyRepo: ParticipantRepository
	) {
		this.company = new Company({ name: '*' });
		this.participant = new Participant({ event: '*', company: '*', contact: '*' });
		this.events = [];
		this.participants = [];
		this.createForm();
	}

	ngOnInit() {
		this._route.paramMap
			.switchMap(params =>
				this._partyRepo.getById(params.get('participant_id') || '__new__')
					.then(participant => {
						this.participant = participant;
						return this._companyRepo.getById(participant ? participant.company : params.get('company_id'))
					})
			)
			.switchMap(company => {
				this.company = company;
				return this._partyRepo.FindByCompany(company._id);
			})
			.switchMap(participants => {
				this.participants = participants;
				return this._eventRepo.findAll();
			})
			.subscribe(events => {
				this.events = events;
				this.initForm();
			});
	}

	private createForm() {
		this.participantForm = this._fb.group({
			event: ['', Validators.required],
			contact: ['', Validators.required]
		});
	}

	private initForm() {
		if (!this.participant) {
			return;
		}
		this.participantForm.setValue({
			event: this.participant.event,
			contact: this.participant.contact
		});
	}
}
