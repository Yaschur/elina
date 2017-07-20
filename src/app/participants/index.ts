import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CompaniesCoreModule } from '../companies/core';
import { EventsCoreModule } from '../events/core';
import { ParticipantsRoutingModule } from './participants-routing.module';

import { ParticipantRepository } from './repositories/participant.repository';
import { ParticipantEditComponent } from './components/participant-edit.component';
// import { ParticipantListComponent } from './components/participant-list.component';

@NgModule({
	imports: [
		ReactiveFormsModule,
		CommonModule,
		CompaniesCoreModule,
		EventsCoreModule,
		ParticipantsRoutingModule
	],
	declarations: [
		ParticipantEditComponent
	],
	providers: [
		ParticipantRepository
	]
})
export class ParticipantModule { }
