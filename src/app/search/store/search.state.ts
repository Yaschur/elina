import { State, Action, StateContext, Selector } from '@ngxs/store';

import { SearchStateModel } from './search-state.model';
import { SetFilter, SearchCompanies } from './search.actions';

@State<SearchStateModel>({
	name: 'search',
	defaults: {
		filter: {},
		results: [],
		selectedCompany: null,
		selectedContact: null,
	},
})
export class SearchState {
	@Selector()
	static getFilter(state: SearchStateModel) {
		return state.filter;
	}

	@Action(SetFilter)
	setFilter(stateContext: StateContext<SearchStateModel>, action: SetFilter) {
		stateContext.patchState({ filter: action.payload });
		stateContext.dispatch(SearchCompanies);
	}
}
