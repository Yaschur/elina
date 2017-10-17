import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { XupdateComponent } from './components/xupdate.component';

const searchRoutes: Routes = [
	{ path: 'xupdate', component: XupdateComponent }
];

@NgModule({
	imports: [RouterModule.forChild(searchRoutes)],
	exports: [RouterModule]
})
export class XupdateRoutingModule { }
