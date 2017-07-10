import { NgModule } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

import { CompaniesCoreModule } from '../companies/core';
import { EventsCoreModule } from '../events/core';

import { ParticipantRepository } from './repositories/participant.repository';
// import { ParticipantListComponent } from './components/participant-list.component';

@NgModule({
	imports: [
		// ReactiveFormsModule,
		// CommonModule,
		CompaniesCoreModule,
		EventsCoreModule
	],
	declarations: [
		// ParticipantListComponent
	],
	providers: [
		ParticipantRepository
	]
})
export class ParticipantModule { }
