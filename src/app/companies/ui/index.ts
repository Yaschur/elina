import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ParticipantModule } from '../../participants';
import { ParticipantListComponent } from '../../participants/components/participant-list.component';
import { CompaniesCoreModule } from '../core';
import { CompaniesRoutingModule } from './companies-routing.module';

import { CompanyVmService } from './services/company-vm.service';
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
		ParticipantModule,
		CompaniesRoutingModule
	],
	declarations: [
		CompanyListComponent,
		CompanyEditComponent,
		CompanyDetailsComponent,
		ContactEditComponent,
		ContactDetailsComponent,
		ParticipantListComponent
	],
	providers: [
		CompanyVmService
	]
})
export class CompaniesModule { }
