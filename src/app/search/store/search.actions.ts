import { Company } from '../../companies/core';

export class SetFilter {
	static readonly type = '[Search] SetFilter';
	constructor(public readonly payload: { set: any; compiled: any[] }) {}
}

export class SearchCompanies {
	static readonly type = '[Search] SearchCompanies';
}

export class LoadCompanies {
	static readonly type = '[Search] LoadCompanies';
	constructor(public readonly payload: Company[]) {}
}

export class SelectCompany {
	static readonly type = '[Search] SelectCompany';
	constructor(public readonly payload: string) {}
}

export class SelectContact {
	static readonly type = '[Search] SelectContact';
	constructor(public readonly payload?: any) {}
}
