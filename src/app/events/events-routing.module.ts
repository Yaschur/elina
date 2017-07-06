import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventListComponent } from './components/event-list.component';

const eventsRoutes: Routes = [
	{ path: 'event', component: EventListComponent }
];

@NgModule({
	imports: [RouterModule.forChild(eventsRoutes)],
	exports: [RouterModule]
})
export class EventsRoutingModule { }
