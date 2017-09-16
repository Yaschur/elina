import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackForwardComponent } from './shared/back-forward.component';
import { CompaniesModule } from './companies/ui';
import { EventsModule } from './events';
import { InfraModule } from './infra';
import { DirectoriesModule } from './directories';
import { SearchModule } from './search';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@NgModule({
	declarations: [
		BackForwardComponent,
		AppComponent
	],
	imports: [
		BrowserModule,
		InfraModule,
		DirectoriesModule,
		CompaniesModule,
		EventsModule,
		SearchModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
