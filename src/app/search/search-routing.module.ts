import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFormComponent } from './components/search-form.component';



const searchRoutes: Routes = [
	{ path: 'search', component: SearchFormComponent }
];

@NgModule({
	imports: [RouterModule.forChild(searchRoutes)],
	exports: [RouterModule]
})
export class SearchRoutingModule { }
