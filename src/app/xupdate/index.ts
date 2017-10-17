import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { XupdateRoutingModule } from './xupdate-routing.module';
import { XupdateComponent } from './components/xupdate.component';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		XupdateRoutingModule
	],
	declarations: [
		XupdateComponent
	],
	providers: [

	]
})
export class XupdateModule { }
