import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CompaniesCoreModule } from './core';
import { CompaniesRoutingModule } from './companies-routing.module';

import { CompanyListComponent } from './components/company-list.component';
import { CompanyEditComponent } from './components/company-edit.component';
import { CompanyDetailsComponent } from './components/company-details.component';
import { ContactEditComponent } from './components/contact-edit.component';
import { ContactDetailsComponent } from './components/contact-details.component';

@NgModule({
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		CompaniesCoreModule,
		CompaniesRoutingModule
	],
	declarations: [
		CompanyListComponent,
		CompanyEditComponent,
		CompanyDetailsComponent,
		ContactEditComponent,
		ContactDetailsComponent
	]
})
export class CompaniesModule { }
