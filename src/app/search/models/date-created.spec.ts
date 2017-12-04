export class DateCreatedSpec implements Spec {

	private _createdBefore: Date;
	private _createdAfter: Date;

	setParam(fromTerm: Date, toTerm: Date) {
		this._createdBefore = toTerm;
		this._createdAfter = fromTerm;
		return this;
	}

	provideFilter(): Promise<any> {
		let filter: any = undefined;
		if (this._createdBefore) {
			filter = { created: { $lt: this._createdBefore } };
		}
		if (this._createdAfter) {
			const nFilter = { created: { $gt: this._createdAfter } };
			filter = filter ? { $and: [filter, nFilter] } : nFilter;
		}

		return Promise.resolve(filter ? filter : { created: { $gt: null } });
	}

}
