import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchFormComponent } from './components/search-form.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchBuilder } from './services/search-builder.service';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		SearchRoutingModule
	],
	declarations: [
		SearchFormComponent
	],
	providers: [
		SearchBuilder
	]
})
export class SearchModule { }
