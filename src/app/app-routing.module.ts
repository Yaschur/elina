import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyListComponent } from './companies/components/company-list.component';
import { CompanyEditComponent } from './companies/components/company-edit.component';
import { CompanyDetailsComponent } from './companies/components/company-details.component';
import { ContactEditComponent } from './companies/components/contact-edit.component';
import { ContactDetailsComponent } from './companies/components/contact-details.component';

const routes: Routes = [
	{ path: 'company', component: CompanyListComponent },
	{ path: 'company/edit/:id', component: CompanyEditComponent },
	{ path: 'company/details/:id', component: CompanyDetailsComponent },
	{ path: 'contact/edit/:company_id/:contact_id', component: ContactEditComponent },
	{ path: 'contact/details/:company_id/:contact_id', component: ContactDetailsComponent },
	{ path: '', redirectTo: 'company', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

// export const routedComponents = [NameComponent];
