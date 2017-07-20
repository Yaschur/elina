import { NgModule } from '@angular/core';

import { CompanyRepository } from './repositories/company.repository';

export * from './models/company.model';
export * from './models/contact.model';
export * from './repositories/company.repository';

@NgModule({
	providers: [
		CompanyRepository
	]
})
export class CompaniesCoreModule { }
