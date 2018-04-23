import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { NgxsModule } from '@ngxs/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackForwardComponent } from './shared/components/back-forward.component';
import { CompaniesModule } from './companies/ui';
import { EventsModule } from './events';
import { InfraModule } from './infra';
import { DirectoriesModule } from './directories';
import { SearchModule } from './search';
import { XupdateModule } from './xupdate';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';

@NgModule({
	declarations: [BackForwardComponent, AppComponent],
	imports: [
		BrowserModule,
		InfraModule,
		DirectoriesModule,
		CompaniesModule,
		EventsModule,
		SearchModule,
		XupdateModule,
		NgxsModule.forRoot(),
		AppRoutingModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
