import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CountryListComponent } from './directories/country-list.component';
import { CountryEditComponent } from './directories/country-edit.component';
import { DbService } from './db/db.service';

const appRoutes: Routes = [
	{ path: 'countries', component: CountryListComponent },
	{ path:'country/edit/:id', component: CountryEditComponent },
	{ path: '', redirectTo: '/countries', pathMatch: 'full' }
];

@NgModule({
	declarations: [
		AppComponent,
		CountryListComponent,
		CountryEditComponent
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
