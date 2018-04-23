export class SetFilter {
	static readonly type = '[Search] SetFilter';
	constructor(public readonly payload?: any) {}
}

export class SelectCompany {
	static readonly type = '[Search] SelectCompany';
	constructor(public readonly payload: string) {}
}

export class SelectContact {
	static readonly type = '[Search] SelectContact';
	constructor(public readonly payload?: any) {}
}
