import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchFormComponent } from './components/search-form.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
	imports: [
		ReactiveFormsModule,
		SearchRoutingModule
	],
	declarations: [
		SearchFormComponent
	],
	providers: [
	]
})
export class SearchModule { }
