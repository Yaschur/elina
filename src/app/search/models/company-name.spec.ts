export class CompanyNameSpec implements Spec {

	private _term: string;

	setParam(term: string): CompanyNameSpec {
		this._term = term;
		return this;
	}

	provideFilter(): Promise<any> {
		return Promise.resolve({ name: { $regex: new RegExp('.*' + this._term + '.*', 'i') } });
	}
}
