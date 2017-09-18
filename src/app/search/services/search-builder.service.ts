export class SearchBuilder {
	private _byNameTerm: string;

	constructor() {
		this.reset();
	}

	reset(): void {
		this._byNameTerm = '';
	}

	searchByName(term: string): void {
		this._byNameTerm = term;
	}

	build(): any {
		const filter = [];
		if (this._byNameTerm) {
			filter.push({ name: { $regex: new RegExp('.*' + this._byNameTerm + '.*', 'i') } });
		}
		return filter;
	}
}
