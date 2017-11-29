export class CountriesSpec implements Spec {

	private _codes: string[] = [];

	setParam(terms: string[]): CountriesSpec {
		this._codes = terms;
		return this;
	}

	provideFilter(): Promise<any> {
		return Promise.resolve(
			this._codes.length > 0 ? { country: { $in: this._codes } } : { country: '' }
		);
	}
}
