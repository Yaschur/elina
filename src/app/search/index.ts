import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SearchState } from './store/search.state';

import { ParticipantModule } from '../participants/';

import { SearchFormComponent } from './components/search-form.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchBuilder } from './services/search-builder.service';
import { NgxsModule } from '@ngxs/store';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		ParticipantModule,
		MultiselectDropdownModule,
		NgxsModule.forFeature([SearchState]),
		SearchRoutingModule,
	],
	declarations: [SearchFormComponent],
	providers: [SearchBuilder],
})
export class SearchModule {}
