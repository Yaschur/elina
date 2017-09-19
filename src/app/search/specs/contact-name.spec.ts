export class ContactNameSpec implements Spec {

	private _term: string;

	constructor(term: string) {
		this._term = term.trim();
	}

	provideFilter() {
		return { contacts: { $elemMatch: { name: { $regex: new RegExp('.*' + this._term + '.*', 'i') } } } };
	}
}
