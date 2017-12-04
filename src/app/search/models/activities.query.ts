export class ActivitiesQuery implements Query {

	private _ids: string[] = [];

	setParam(terms: string[]): ActivitiesQuery {
		this._ids = terms;
		return this;
	}

	async provideFilter(): Promise<any> {
		return Promise.resolve(
			this._ids.length === 0 ? { activities: { $size: 0 } } : { activities: { $elemMatch: { $in: this._ids } } }
		);
	}
}
