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
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
