import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompaniesModule } from './companies';
import { EventsModule } from './events';
import { InfraModule } from './infra';
import { DirectoriesModule } from './directories';

@NgModule({
	declarations: [
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
