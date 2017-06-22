import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DbMaintenanceComponent } from './maintenance/db-maintenance.component';

const infraRoutes: Routes = [
	{ path: 'system/dbmaintenance', component: DbMaintenanceComponent }
];

@NgModule({
	imports: [RouterModule.forChild(infraRoutes)],
	exports: [RouterModule]
})
export class InfraRoutingModule { }
