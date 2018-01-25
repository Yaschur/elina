import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxElectronModule } from 'ngx-electron';

import { InfraRoutingModule } from './infra-routing.module';

import { DbMaintService } from './store/db-maint.service';
import { StoreService } from './store/store.service';
import { XlsxService } from './xlsx/xlsx.service';
import { ConfigService } from './config.service';

import { DbMaintenanceComponent } from './maintenance/db-maintenance.component';
import { ConfigComponent } from './maintenance/config.component';
import { UsettingsService } from './usettings/usettings.service';

export * from './store/store.service';
export * from './xlsx/xlsx.service';
export * from './config.service';
export * from './entity.model';
export * from './usettings/usettings.service';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NgxElectronModule,
		InfraRoutingModule
	],
	declarations: [
		DbMaintenanceComponent,
		ConfigComponent
	],
	providers: [
		ConfigService,
		DbMaintService,
		StoreService,
		XlsxService,
		UsettingsService
	],
})
export class InfraModule { }
