import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { InfraModule } from './infra/infra.module';

import { AppComponent } from './app.component';
import { CountryListComponent } from './directories/country-list.component';
import { CountryEditComponent } from './directories/country-edit.component';
import { RegionListComponent } from './directories/region-list.component';
import { RegionEditComponent } from './directories/region-edit.component';
import { ListHeaderComponent } from './directories/components/list-header.component';
import { EditHeaderComponent } from './directories/components/edit-header.component';
import { EntryListComponent } from './directories/entry-list.component';
import { EntryEditComponent } from './directories/entry-edit.component';
import { DirectoryRepository } from './directories/repositories/directory.repository';
import { DirectoryService } from './directories/services/directory.service';

import { CompanyListComponent } from './companies/company-list.component';

const appRoutes: Routes = [
	{ path: 'company', component: CompanyListComponent },
	{ path: 'directory/country', component: CountryListComponent },
	{ path: 'directory/region', component: RegionListComponent },
	{ path: 'directory/country/:id', component: CountryEditComponent },
	{ path: 'directory/region/:id', component: RegionEditComponent },
	{ path: 'directory/:entry', component: EntryListComponent },
	{ path: 'directory/:entry/:id', component: EntryEditComponent },
	{ path: '', redirectTo: 'directory/country', pathMatch: 'full' }
];

@NgModule({
	declarations: [
		AppComponent,
		CountryListComponent,
		CountryEditComponent,
		RegionListComponent,
		RegionEditComponent,
		ListHeaderComponent,
		EditHeaderComponent,
		EntryListComponent,
		EntryEditComponent,
		CompanyListComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(appRoutes),
		InfraModule
	],
	providers: [DirectoryRepository, DirectoryService],
	bootstrap: [AppComponent]
})
export class AppModule { }
