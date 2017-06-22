import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountryListComponent } from './directories/country-list.component';
import { CountryEditComponent } from './directories/country-edit.component';
import { RegionListComponent } from './directories/region-list.component';
import { RegionEditComponent } from './directories/region-edit.component';
import { ListHeaderComponent } from './directories/components/list-header.component';
import { EditHeaderComponent } from './directories/components/edit-header.component';
import { EntryListComponent } from './directories/entry-list.component';
import { EntryEditComponent } from './directories/entry-edit.component';
import { CompanyListComponent } from './companies/company-list.component';
import { CompanyEditComponent } from './companies/company-edit.component';
import { CompanyDetailsComponent } from './companies/company-details.component';
import { ContactEditComponent } from './companies/contact-edit.component';
import { ContactDetailsComponent } from './companies/contact-details.component';

const routes: Routes = [
	{ path: 'company', component: CompanyListComponent },
	{ path: 'company/edit/:id', component: CompanyEditComponent },
	{ path: 'company/details/:id', component: CompanyDetailsComponent },
	{ path: 'contact/edit/:company_id/:contact_id', component: ContactEditComponent },
	{ path: 'contact/details/:company_id/:contact_id', component: ContactDetailsComponent },
	{ path: 'directory/country', component: CountryListComponent },
	{ path: 'directory/region', component: RegionListComponent },
	{ path: 'directory/country/:id', component: CountryEditComponent },
	{ path: 'directory/region/:id', component: RegionEditComponent },
	{ path: 'directory/:entry', component: EntryListComponent },
	{ path: 'directory/:entry/:id', component: EntryEditComponent },
	{ path: 'directory/:entry/:id', component: EntryEditComponent },
	{ path: '', redirectTo: 'company', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

// export const routedComponents = [NameComponent];
