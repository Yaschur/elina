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

	targetParticipant: Observable<Participant>;
	targetCompany: Observable<Company>;
	targetContact: Observable<Contact>;
	categories: Observable<ParticipantCategory[]>;
	statuses: Observable<ParticipantStatus[]>;

	arrivalDate: Date;
	departureDate: Date;

	private targetParticipantId: string;

	constructor(
		private _route: ActivatedRoute,
		private _location: Location,
		private _fb: FormBuilder,
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
		private _partyRepo: ParticipantRepository,
		private _dirSrv: DirectoryService
	) {

		this.createForm();
	}

	ngOnInit() {

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
