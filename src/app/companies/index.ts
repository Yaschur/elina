import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InfraModule } from '../infra';
import { DirectoriesModule } from '../directories';
import { CompaniesRoutingModule } from './companies-routing.module'

import { CompanyRepository } from './repositories/company.repository';
import { CompanyListComponent } from './components/company-list.component';
import { CompanyEditComponent } from './components/company-edit.component';
import { CompanyDetailsComponent } from './components/company-details.component';
import { ContactEditComponent } from './components/contact-edit.component';
import { ContactDetailsComponent } from './components/contact-details.component';

export * from './models/company.model';
export * from './models/contact.model';
export * from './repositories/company.repository';

@NgModule({
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		InfraModule,
		DirectoriesModule,
		CompaniesRoutingModule
	],
	declarations: [
		CompanyListComponent,
		CompanyEditComponent,
		CompanyDetailsComponent,
		ContactEditComponent,
		ContactDetailsComponent
	],
	providers: [
		CompanyRepository
	]
})
export class CompaniesModule { }
