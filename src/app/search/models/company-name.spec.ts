export class CompanyNameSpec implements Spec {

	private _term: string;
	private _remoteMode: boolean;

	setParam(term: string, remoteMode: boolean): CompanyNameSpec {
		this._term = term;
		this._remoteMode = remoteMode;
		return this;
	}

	provideFilter(): Promise<any> {
		return Promise.resolve({ name: { $regex: (this._remoteMode ? '(*UTF8)(?i)' + this._term : new RegExp('.*' + this._term + '.*', 'i')) } });
	}
}
