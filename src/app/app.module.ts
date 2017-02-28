import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CountryListComponent } from './directories/country-list.component';
import { CountryEditComponent } from './directories/country-edit.component';
import { RegionListComponent } from './directories/region-list.component';
import { RegionEditComponent } from './directories/region-edit.component';
import { DbService } from './db/db.service';

const appRoutes: Routes = [
	{ path: 'countries', component: CountryListComponent },
	{ path: 'regions', component: RegionListComponent },
	{ path:'country/edit/:id', component: CountryEditComponent },
	{ path:'region/edit/:id', component: RegionEditComponent },
	{ path: '', redirectTo: '/countries', pathMatch: 'full' }
];

@NgModule({
	declarations: [
		AppComponent,
		CountryListComponent,
		CountryEditComponent,
		RegionListComponent,
		RegionEditComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(appRoutes)
	],
	providers: [DbService],
	bootstrap: [AppComponent]
})
export class AppModule { }
