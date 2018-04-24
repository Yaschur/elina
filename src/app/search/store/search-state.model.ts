import { Company, Contact } from '../../companies/core';
import { AppStateModel } from '../../shared/store/app-state.model';

export interface SearchStateModel extends AppStateModel {
	filter: any;
	compiledFilter: any[];
	resultMode: '' | 'company' | 'contact';
	results: Company[];
	selectedCompany: string;
	selectedContact: string;
}
