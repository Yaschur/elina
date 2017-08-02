import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParticipantAddComponent } from './components/participant-add.component';
import { ParticipantEditComponent } from './components/participant-edit.component';

const participantsRoutes: Routes = [
	{ path: 'participant/add', component: ParticipantAddComponent },
	{ path: 'participant/edit/:participant_id', component: ParticipantEditComponent }
];

@NgModule({
	imports: [RouterModule.forChild(participantsRoutes)],
	exports: [RouterModule]
})
export class ParticipantsRoutingModule { }
