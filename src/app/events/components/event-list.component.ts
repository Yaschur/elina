import { Component, OnInit } from '@angular/core';

import { EventRepository } from '../repositories/event.repository';

@Component({
	selector: 'app-event-list',
	templateUrl: 'event-list.component.html'
})

export class EventListComponent implements OnInit {
	constructor(private _eventRepository: EventRepository) { }

	ngOnInit() { }
}
