import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyRepository } from './repositories/company.repository';
import { CompanyListComponent } from './components/company-list.component';
import { CompanyEditComponent } from './components/company-edit.component';
import { CompanyDetailsComponent } from './components/company-details.component';
import { ContactEditComponent } from './components/contact-edit.component';
import { ContactDetailsComponent } from './components/contact-details.component';

const companiesRoutes: Routes = [
	{ path: 'company', component: CompanyListComponent },
	{ path: 'company/edit/:id', component: CompanyEditComponent },
	{ path: 'company/details/:id', component: CompanyDetailsComponent },
	{ path: 'contact/edit/:company_id/:contact_id', component: ContactEditComponent },
	{ path: 'contact/details/:company_id/:contact_id', component: ContactDetailsComponent }
];

@NgModule({
	imports: [RouterModule.forChild(companiesRoutes)],
	exports: [RouterModule]
})
export class CompaniesRoutingModule { }