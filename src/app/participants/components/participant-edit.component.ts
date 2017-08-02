import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { Company, CompanyRepository, Contact } from '../../companies/core';
import { Event, EventRepository } from '../../events/core';
import { Participant } from '../models/participant.model';
import { DirectoryService, ParticipantCategory, ParticipantStatus } from '../../directories';
import { ParticipantRepository } from '../repositories/participant.repository';

@Component({
	selector: 'app-participant-edit',
	templateUrl: 'participant-edit.component.html'
})

export class ParticipantEditComponent implements OnInit {
	participantForm: FormGroup;

	targetParticipant: Participant;
	targetCompany: Company;
	targetContact: Contact;
	targetEvent: Event;
	categories: Observable<ParticipantCategory[]>;
	statuses: Observable<ParticipantStatus[]>;

	arrivalDate: Date;
	departureDate: Date;

	constructor(
		private _route: ActivatedRoute,
		private _location: Location,
		private _fb: FormBuilder,
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
		private _partyRepo: ParticipantRepository,
		private _dirSrv: DirectoryService
	) {
		this.categories = _dirSrv.getDir('participantcategory').data;
		this.statuses = _dirSrv.getDir('participantstatus').data;
		this.createForm();
	}

	ngOnInit() {
		this._route.paramMap
			.switchMap(params => this._partyRepo.getById(params.get('participant_id')))
			.subscribe(participant => {
				this._companyRepo.getById(participant.company)
					.then(company => {
						this.targetCompany = company;
						this.targetContact = company.contacts.filter(c => c._id === participant.contact)[0];
					})
					.catch(e => console.log(e));
				this._eventRepo.getById(participant.event)
					.then(event => this.targetEvent = event)
					.catch(e => console.log(e));
				this.arrivalDate = participant.arrivalDate;
				this.departureDate = participant.departureDate;
				this.participantForm.get('category').setValue(participant.category);
				this.participantForm.get('status').setValue(participant.status);
				this.participantForm.get('registrationFee').setValue(participant.registrationFee);
				this.participantForm.get('freeNights').setValue(participant.freeNights);
				this.participantForm.get('visaRequired').setValue(participant.visaRequired);
				this.participantForm.get('participantValidated').setValue(participant.participantValidated);
			});
	}

	onCancel() {
		this._location.back();
	}

	private createForm() {
		this.participantForm = this._fb.group({
			category: ['', Validators.required],
			status: ['', Validators.required],

			registrationFee: '',
			freeNights: '',
			// arrivalDate: '',
			// departureDate: '',
			visaRequired: false,
			participantValidated: false
		});
	}
}
