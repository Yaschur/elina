import { NgModule } from '@angular/core';

import { EventsRoutingModule } from './events-routing.module'

import { EventRepository } from './repositories/event.repository';
import { EventListComponent } from './components/event-list.component';

export * from './models/event.model';
export * from './repositories/event.repository';

@NgModule({
	imports: [
		EventsRoutingModule
	],
	declarations: [
		EventListComponent
	],
	providers: [
		EventRepository
	]
})
export class EventsModule { }
