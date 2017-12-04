import { DirectoryService, Region } from '../../directories';
import { CountriesQuery } from './countries.query';

export class RegionsQuery implements Query {

	private _ids: string[] = [];

	constructor(private _regions: Region[]) { }

	setParam(terms: string[]): RegionsQuery {
		this._ids = terms;
		return this;
	}

	async provideFilter(): Promise<any> {
		const codes = this._regions
			.filter(r => this._ids.some(id => id === r._id))
			.reduce((cs, c) => cs.concat(<string[]>(<Region>c).countries), []);
		return Promise.resolve(
			(new CountriesQuery()).setParam(codes).provideFilter()
		);
	}
}
