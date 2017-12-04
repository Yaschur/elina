import { DirectoryService, Region } from '../../directories';
import { CountriesQuery } from './countries.query';

export class RegionsQuery implements Query {

	private _ids: string[] = [];

	constructor(private _dirSrv: DirectoryService) { }

	setParam(terms: string[]): RegionsQuery {
		this._ids = terms;
		return this;
	}

	async provideFilter(): Promise<any> {
		const codes = await this._dirSrv.getDir('region').data
			.map(regions => regions.filter(region => this._ids.some(id => id === region._id)))
			.flatMap(regions => regions.map(region => (<Region>region).countries))
			.toPromise();
		return (new CountriesQuery()).setParam(codes).provideFilter();
	}
}
