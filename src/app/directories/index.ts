import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DirectoryRepository } from './repositories/directory.repository';
import { DirectoryService } from './services/directory.service';
import { ListHeaderComponent } from './shared/list-header.component';
import { EditHeaderComponent } from './shared/edit-header.component';
import { CountryListComponent } from './components/country-list.component';
import { CountryEditComponent } from './components/country-edit.component';
import { RegionListComponent } from './components/region-list.component';
import { RegionEditComponent } from './components/region-edit.component';
import { EntryListComponent } from './components/entry-list.component';
import { EntryEditComponent } from './components/entry-edit.component';
import { DirectoriesRoutingModule } from './directories-routing.module';

export * from './models/activity.model';
export * from './models/content-responsibility.model';
export * from './models/country.model';
export * from './models/region.model';
export * from './models/job-responsibility.model';
export * from './models/participant-category.model';
export * from './models/participant-status.model';
export * from './services/directory.service';

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		DirectoriesRoutingModule
	],
	declarations: [
		ListHeaderComponent,
		EditHeaderComponent,
		CountryEditComponent,
		CountryListComponent,
		RegionEditComponent,
		RegionListComponent,
		EntryEditComponent,
		EntryListComponent
	],
	providers: [
		DirectoryRepository,
		DirectoryService
	],
})
export class DirectoriesModule { }
