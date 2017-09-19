export class CompanyNameSpec implements Spec {

	private _term: string;

	constructor(term: string) {
		this._term = term.trim();
	}

	provideFilter(): any {
		return { name: { $regex: new RegExp('.*' + this._term + '.*', 'i') } };
	}
}
