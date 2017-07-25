import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParticipantAddComponent } from './components/participant-add.component';

const participantsRoutes: Routes = [
	{ path: 'participant/add', component: ParticipantAddComponent }
];

@NgModule({
	imports: [RouterModule.forChild(participantsRoutes)],
	exports: [RouterModule]
})
export class ParticipantsRoutingModule { }
