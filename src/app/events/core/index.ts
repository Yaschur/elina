import { NgModule } from '@angular/core';

import { EventRepository } from './repositories/event.repository';

export * from './models/event.model';
export * from './repositories/event.repository';

@NgModule({
	providers: [
		EventRepository
	]
})
export class EventsCoreModule { }
