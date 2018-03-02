export class RetiredQuery implements Query {

	private _active: boolean;
	private _inactive: boolean;

	setParam(includeActive: boolean, includeInactive: boolean) {
		this._active = includeActive;
		this._inactive = includeInactive;
		return this;
	}

	provideFilter(): Promise<any> {
		if (this._active && this._inactive) {
			return null;
		}
		return Promise.resolve({ active: (this._active ? true : false) });
	}
}
