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
import { ListHeaderComponent } from './directories/components/list-header.component';
import { EditHeaderComponent } from './directories/components/edit-header.component';
import { StoreService } from './db/store.service';

const appRoutes: Routes = [
	{ path: 'countries', component: CountryListComponent },
	{ path: 'regions', component: RegionListComponent },
	{ path: 'country/edit/:id', component: CountryEditComponent },
	{ path: 'region/edit/:id', component: RegionEditComponent },
	{ path: '', redirectTo: '/countries', pathMatch: 'full' }
];

@NgModule({
	declarations: [
		AppComponent,
		CountryListComponent,
		CountryEditComponent,
		RegionListComponent,
		RegionEditComponent,
		ListHeaderComponent,
		EditHeaderComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(appRoutes)
	],
	providers: [StoreService],
	bootstrap: [AppComponent]
})
export class AppModule { }
