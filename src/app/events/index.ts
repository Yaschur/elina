import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ParticipantModule } from '../participants';
import { EventsCoreModule } from './core';
import { EventsRoutingModule } from './events-routing.module';

import { EventListComponent } from './components/event-list.component';
import { EventEditComponent } from './components/event-edit.component';

@NgModule({
	imports: [
		ReactiveFormsModule,
		CommonModule,
		EventsCoreModule,
		ParticipantModule,
		EventsRoutingModule
	],
	declarations: [
		EventListComponent,
		EventEditComponent
	]
})
export class EventsModule { }
