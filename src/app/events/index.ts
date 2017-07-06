import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module'

import { EventRepository } from './repositories/event.repository';
import { EventListComponent } from './components/event-list.component';
import { EventEditComponent } from './components/event-edit.component';

export * from './models/event.model';
export * from './repositories/event.repository';

@NgModule({
	imports: [
		ReactiveFormsModule,
		CommonModule,
		EventsRoutingModule
	],
	declarations: [
		EventListComponent,
		EventEditComponent
	],
	providers: [
		EventRepository
	]
})
export class EventsModule { }
