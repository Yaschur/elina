import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { InfraModule } from './infra';
import { DirectoriesModule } from './directories';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CompanyRepository } from './companies/repositories/company.repository';
import { CompanyListComponent } from './companies/components/company-list.component';
import { CompanyEditComponent } from './companies/components/company-edit.component';
import { CompanyDetailsComponent } from './companies/components/company-details.component';
import { ContactEditComponent } from './companies/components/contact-edit.component';
import { ContactDetailsComponent } from './companies/components/contact-details.component';

@NgModule({
	declarations: [
		AppComponent,
		CompanyListComponent,
		CompanyEditComponent,
		CompanyDetailsComponent,
		ContactEditComponent,
		ContactDetailsComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		InfraModule,
		DirectoriesModule,
		AppRoutingModule
	],
	providers: [
		CompanyRepository
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
