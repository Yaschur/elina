import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountryListComponent } from './components/country-list.component';
import { CountryEditComponent } from './components/country-edit.component';
import { RegionListComponent } from './components/region-list.component';
import { RegionEditComponent } from './components/region-edit.component';
import { EntryListComponent } from './components/entry-list.component';
import { EntryEditComponent } from './components/entry-edit.component';

const directoriesRoutes: Routes = [
	{ path: 'directory/country', component: CountryListComponent },
	{ path: 'directory/region', component: RegionListComponent },
	{ path: 'directory/country/:id', component: CountryEditComponent },
	{ path: 'directory/region/:id', component: RegionEditComponent },
	{ path: 'directory/:entry', component: EntryListComponent },
	{ path: 'directory/:entry/:id', component: EntryEditComponent }
];

@NgModule({
	imports: [RouterModule.forChild(directoriesRoutes)],
	exports: [RouterModule]
})
export class DirectoriesRoutingModule { }
