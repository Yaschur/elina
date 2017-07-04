import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';

import { InfraRoutingModule } from './infra-routing.module';

import { DbMaintService } from './store/db-maint.service';
import { StoreService } from './store/store.service';
import { ConfigService } from './config.service';

import { DbMaintenanceComponent } from './maintenance/db-maintenance.component';

export * from './store/store.service';
export * from './config.service';
export * from './entity.model';

@NgModule({
	imports: [
		NgxElectronModule,
		InfraRoutingModule
	],
	declarations: [
		DbMaintenanceComponent
	],
	providers: [
		ConfigService,
		DbMaintService,
		StoreService
	],
})
export class InfraModule { }
