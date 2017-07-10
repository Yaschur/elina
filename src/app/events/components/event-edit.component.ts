import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { EventRepository, Event } from '../core';

@Component({
	selector: 'app-event-edit',
	templateUrl: 'event-edit.component.html'
})

export class EventEditComponent implements OnInit {
	event: Event;
	eventForm: FormGroup;

	constructor(
		private _eventRepo: EventRepository,
		private _route: ActivatedRoute,
		private _router: Router,
		private _location: Location,
		private _fb: FormBuilder
	) {
		this.createForm();
	}

	ngOnInit() {
		this._route.params
			.switchMap(params => this._eventRepo.getById(params['id']))
			.subscribe(item => {
				this.event = item;
				this.initForm();
			});
	}

	onSubmit() {
		const event = new Event({
			_id: this.event ? this.event._id : null,
			name: this.eventForm.get('name').value.trim()
		});
		this._eventRepo.store(event)
			// .then(() => this._router.navigate(['event/details', event._id]))
			.then(() => this._router.navigate(['event']))
			.catch(e => console.log(e));
	}

	onCancel() {
		this._location.back();
	}

	private createForm() {
		this.eventForm = this._fb.group({
			name: ['', Validators.required]
		});
	}

	private initForm() {
		if (!this.event) {
			return;
		}
		this.eventForm.setValue({
			name: this.event.name
		});
	}
}
