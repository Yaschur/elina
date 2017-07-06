import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventListComponent } from './components/event-list.component';
import { EventEditComponent } from './components/event-edit.component';

const eventsRoutes: Routes = [
	{ path: 'event', component: EventListComponent },
	{ path: 'event/edit/:id', component: EventEditComponent },
];

@NgModule({
	imports: [RouterModule.forChild(eventsRoutes)],
	exports: [RouterModule]
})
export class EventsRoutingModule { }
