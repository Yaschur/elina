import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';

import { Company, CompanyRepository, Contact } from '../../companies/core';
import { EventRepository, Event } from '../../events/core';
import { ParticipantCategory, ParticipantStatus, DirectoryService } from '../../directories';
import { ParticipantRepository } from '../repositories/participant.repository';
import { Participant } from '../models/participant.model';

@Component({
	selector: 'app-participant-add',
	templateUrl: 'participant-add.component.html'
})

export class ParticipantAddComponent implements OnInit {
	participantForm: FormGroup;

	targetCompany: Observable<Company>;
	allEvents: Observable<Event[]>;
	allowedContacts: Subject<Contact[]>;
	categories: Observable<ParticipantCategory[]>;
	statuses: Observable<ParticipantStatus[]>;

	private targetCompanyId: string;
	private targetContacts: Contact[];

	constructor(
		private _route: ActivatedRoute,
		private _location: Location,
		private _fb: FormBuilder,
		private _companyRepo: CompanyRepository,
		private _eventRepo: EventRepository,
		private _partyRepo: ParticipantRepository,
		private _dirSrv: DirectoryService
	) {
		this.allowedContacts = new Subject<Contact[]>();
		this.categories = _dirSrv.getDir('participantcategory').data;
		this.statuses = _dirSrv.getDir('participantstatus').data;
		this.targetCompany = this._route.paramMap
			.switchMap(params => this._companyRepo.getById(params.get('company_id')));
		this.targetCompany
			.subscribe(company => {
				this.allEvents = Observable.fromPromise(
					this._eventRepo.findAll()
				);
				this.targetCompanyId = company._id;
				this.targetContacts = company.contacts
					.filter(c => c.active);
			});
		this.createForm();
	}

	ngOnInit() {

	}

	async onSubmit() {
		try {
			const participant = new Participant({
				event: this.participantForm.get('event').value,
				company: this.targetCompanyId,
				contact: this.participantForm.get('contact').value,
				category: this.participantForm.get('category').value,
				status: this.participantForm.get('status').value,
				registrationFee: this.participantForm.get('registrationFee').value.trim(),
				freeNights: this.participantForm.get('freeNights').value.trim()
			});
			const exPrt = await this._partyRepo.getByAllRefIds(participant.event, participant.company, participant.contact);
			if (exPrt) {
				throw Error('participant already exists');
			}
			await this._partyRepo.store(participant);
			this.participantForm.get('event').updateValueAndValidity({ onlySelf: false, emitEvent: true });
			this.participantForm.get('category').setValue('');
			this.participantForm.get('status').setValue('');
			this.participantForm.get('registrationFee').setValue('');
			this.participantForm.get('freeNights').setValue('');
		} catch (e) {
			console.log(e);
		}
	}

	onCancel() {
		this._location.back();
	}

	private createForm() {

		this.participantForm = this._fb.group({
			event: ['', Validators.required],
			contact: ['', Validators.required],
			category: ['', Validators.required],
			status: ['', Validators.required],

			registrationFee: '',
			freeNights: ''
		});

		this.participantForm.get('event').valueChanges
			.switchMap(eventId =>
				eventId ? this._partyRepo.FindByCompanyAndEvent(this.targetCompanyId, eventId) : Observable.of(null)
			)
			.subscribe(participants => {
				this.participantForm.get('contact').setValue('');
				if (!participants) {
					this.allowedContacts.next([]);
					return;
				}
				const filteredContacts = this.targetContacts.filter(c => participants.every(p => p.contact !== c._id));
				this.allowedContacts.next(filteredContacts);
			});
	}
}
