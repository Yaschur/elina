export class CountriesQuery implements Query {

	private _codes: string[] = [];

	setParam(terms: string[]): CountriesQuery {
		this._codes = terms || [''];
		return this;
	}

	provideFilter(): Promise<any> {
		return Promise.resolve(
			this._codes.length > 0 ? { country: { $in: this._codes } } : { country: '' }
		);
	}
}
