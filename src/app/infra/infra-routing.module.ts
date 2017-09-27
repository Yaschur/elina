import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DbMaintenanceComponent } from './maintenance/db-maintenance.component';
import { ConfigComponent } from './maintenance/config.component';

const infraRoutes: Routes = [
	{ path: 'system/dbmaintenance', component: DbMaintenanceComponent },
	{ path: 'system/config', component: ConfigComponent }
];

@NgModule({
	imports: [RouterModule.forChild(infraRoutes)],
	exports: [RouterModule]
})
export class InfraRoutingModule { }
