import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Company, CompanyRepository } from '../../companies/core';
import { EventRepository, Event } from '../../events/core';
import { ParticipantRepository } from '../repositories/participant.repository';

@Component({
	selector: 'app-participant-add',
	templateUrl: 'participant-add.component.html'
})

export class ParticipantAddComponent implements OnInit {
	participantForm: FormGroup;

	targetCompany: Observable<Company>;
	allEvents: Observable<Event[]>;

	constructor(
		private _route: ActivatedRoute,
		private _fb: FormBuilder,
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
		private _partyRepo: ParticipantRepository
	) {
		this.targetCompany = this._route.paramMap
			.switchMap(params => this._companyRepo.getById(params.get('company_id')));
		this.targetCompany
			.subscribe(company =>
				this.allEvents = Observable.fromPromise(
					this._eventRepo.findAll()
				)
			);
		this.createForm();
	}

	ngOnInit() {

	}

	private createForm() {
		this.participantForm = this._fb.group({
			event: [[], Validators.required],
			contact: [[], Validators.required]
		});
	}
}
