import { State } from '@ngxs/store';

import { SearchStateModel } from './search-state.model';

@State<SearchStateModel>({
	name: 'search',
	defaults: {
		filter: {},
		results: [],
	},
})
export class SearchState {}
