import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { EventRepository, Event } from '../core';

@Component({
	selector: 'app-event-list',
	templateUrl: 'event-list.component.html'
})

export class EventListComponent implements OnInit {
	events: Observable<Event[]>;

	constructor(
		private _eventRepository: EventRepository,
		private _router: Router
	) { }

	ngOnInit() {
		this.events = Observable.fromPromise(this._eventRepository.findAll());
	}

	addNew(): void {
		this._router.navigate(['event/edit', '__new__']);
	}

	details(id): void {
		this._router.navigate(['event/edit', id]);
	}
}
