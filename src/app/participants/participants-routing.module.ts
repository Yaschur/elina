import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParticipantEditComponent } from './components/participant-edit.component';

const participantsRoutes: Routes = [
	{ path: 'participant/edit', component: ParticipantEditComponent }
];

@NgModule({
	imports: [RouterModule.forChild(participantsRoutes)],
	exports: [RouterModule]
})
export class ParticipantsRoutingModule { }
