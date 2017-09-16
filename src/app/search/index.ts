import { NgModule } from '@angular/core';

import { SearchFormComponent } from './components/search-form.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
	imports: [
		SearchRoutingModule
	],
	declarations: [
		SearchFormComponent
	],
	providers: [
	]
})
export class SearchModule { }
