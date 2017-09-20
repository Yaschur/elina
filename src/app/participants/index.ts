import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap';

import { EventsCoreModule } from '../events/core';
import { ParticipantsRoutingModule } from './participants-routing.module';

import { ParticipantRepository } from './repositories/participant.repository';
import { ParticipantEditComponent } from './components/participant-edit.component';
import { ParticipantAddComponent } from './components/participant-add.component';

export * from './repositories/participant.repository';

@NgModule({
	imports: [
		ReactiveFormsModule,
		CommonModule,
		ModalModule.forRoot(),
		EventsCoreModule,
		ParticipantsRoutingModule
	],
	declarations: [
		ParticipantEditComponent,
		ParticipantAddComponent
	],
	providers: [
		ParticipantRepository
	]
})
export class ParticipantModule { }
