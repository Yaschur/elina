import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
	modalRef: BsModalRef;

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
		private _dirSrv: DirectoryService,
		private modalService: BsModalService
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
				this.participantForm.get('arrivalDate').setValue(participant.arrivalDate);
				this.participantForm.get('departureDate').setValue(participant.departureDate);
				this.participantForm.get('category').setValue(participant.category);
				this.participantForm.get('status').setValue(participant.status);
				this.participantForm.get('registrationFee').setValue(participant.registrationFee);
				this.participantForm.get('freeNights').setValue(participant.freeNights);
				this.participantForm.get('visaRequired').setValue(participant.visaRequired);
				this.participantForm.get('participantValidated').setValue(participant.participantValidated);
				this.targetParticipant = participant;
			});
	}

	async onSubmit() {
		try {
			['category', 'status', 'registrationFee', 'freeNights', 'arrivalDate', 'departureDate', 'visaRequired', 'participantValidated']
				.forEach(s => {
					const field = this.participantForm.get(s);
					if (field.dirty && !field.invalid) {
						this.targetParticipant[s] = field.value;
					}
				});
			this.targetParticipant.updated = new Date();

			await this._partyRepo.store(this.targetParticipant);
		} catch (e) {
			console.log(e);
		}
		this._location.back();
	}
	async onDelete() {
		try {
			this.modalRef.hide();
			this.modalRef = undefined;
			await this._partyRepo.remove(this.targetParticipant);
			this._location.back();
		} catch (e) {
			console.log(e);
		}
	}

	onCancel() {
		this._location.back();
	}

	deleteConfirm(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, { keyboard: false, backdrop: false, ignoreBackdropClick: true });
	}
	deleteCancel() {
		this.modalRef.hide();
		this.modalRef = undefined;
	}

	private createForm() {
		this.participantForm = this._fb.group({
			category: ['', Validators.required],
			status: ['', Validators.required],

			registrationFee: '',
			freeNights: '',
			arrivalDate: '',
			departureDate: '',
			visaRequired: false,
			participantValidated: false
		});
	}
}
