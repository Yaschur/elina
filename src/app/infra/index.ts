import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';

import { DbMaintService } from './store/db-maint.service';
import { StoreService } from './store/store.service';
import { ConfigService } from './config.service';

export * from './store/db-maint.service';
export * from './store/store.service';
export * from './config.service';
export * from './entity.model';

@NgModule({
	imports: [
		NgxElectronModule
	],
	exports: [],
	declarations: [],
	providers: [
		ConfigService,
		DbMaintService,
		StoreService
	],
})
export class InfraModule { }
