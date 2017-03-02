import { Injectable } from '@angular/core';
import { StoreService } from '../../db/store.service';
import { Country } from '../models/country.model';

@Injectable()
export class CountryRepository {
	static typeName = 'country';

	constructor(private _dbService: StoreService) { }

	public async store(country: Country) {
		await this._dbService.store(CountryRepository.typeName, country);
	}

	public async remove(country: Country) {
		await this._dbService.remove(CountryRepository.typeName, country);
	}

	public async getById(id: string): Promise<Country> {
		const dbItem = await this._dbService.get(CountryRepository.typeName, id);
		if (!dbItem) {
			return null;
		}
		return new Country(dbItem._id, dbItem.name);
	}

	public async findAll(): Promise<Country[]> {
		return (await this._dbService.find(
			CountryRepository.typeName,
			{ name: { $gt: null } },
			['name']
		)).map(dbItem => new Country(dbItem._id, dbItem.name));
	}
}
