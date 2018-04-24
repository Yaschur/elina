import { State, Action, StateContext, Selector } from '@ngxs/store';

import { SearchStateModel } from './search-state.model';
import { SetFilter, SearchCompanies, LoadCompanies } from './search.actions';
import { CompanyRepository } from '../../companies/core';

@State<SearchStateModel>({
	name: 'search',
	defaults: {
		filter: {},
		compiledFilter: [],
		results: [],
		resultMode: '',
		selectedCompany: null,
		selectedContact: null,
	},
})
export class SearchState {
	@Selector()
	static getFilter(state: SearchStateModel) {
		return state.filter;
	}
	@Selector()
	static getResultMode(state: SearchStateModel) {
		return state.resultMode;
	}
	@Selector()
	static getResults(state: SearchStateModel) {
		return state.results;
	}

	constructor(private _companyRepo: CompanyRepository) {}

	@Action(SetFilter)
	setFilter(stateContext: StateContext<SearchStateModel>, action: SetFilter) {
		stateContext.patchState({
			filter: action.payload.set,
			compiledFilter: action.payload.compiled,
			resultMode: action.payload.mode,
		});
		stateContext.dispatch(SearchCompanies);
	}

	@Action(SearchCompanies)
	async searchCompanies(stateContext: StateContext<SearchStateModel>) {
		const filter = stateContext.getState().compiledFilter;
		const companies = await this._companyRepo.findByFilter(filter);
		stateContext.dispatch(new LoadCompanies(companies));
	}

	@Action(LoadCompanies)
	loadCompanies(
		stateContext: StateContext<SearchStateModel>,
		action: LoadCompanies
	) {
		stateContext.patchState({
			results: action.payload,
		});
	}
}
