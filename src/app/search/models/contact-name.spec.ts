export class ContactNameSpec implements Spec {

	private _term: string;

	setParam(term: string): ContactNameSpec {
		this._term = term;
		return this;
	}

	provideFilter(): Promise<any> {
		return Promise.resolve({ contacts: { $elemMatch: { name: { $regex: new RegExp('.*' + this._term + '.*', 'i') } } } });
	}
}
