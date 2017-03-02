import { Injectable } from '@angular/core';
import { StoreService } from '../../db/store.service';
import { Region } from '../models/region.model';

@Injectable()
export class RegionRepository {
	static typeName = 'region';

	constructor(private _dbService: StoreService) { }

	public async store(region: Region) {
		await this._dbService.store(RegionRepository.typeName, region);
	}

	public async remove(region: Region) {
		await this._dbService.remove(RegionRepository.typeName, region);
	}

	public async getById(id: string): Promise<Region> {
		const dbItem = await this._dbService.get(RegionRepository.typeName, id);
		if (!dbItem) {
			return null;
		}
		return new Region(dbItem._id, dbItem.name, dbItem.countries);
	}

	public async findAll(): Promise<Region[]> {
		return (await this._dbService.find(
			RegionRepository.typeName,
			{ name: { $gt: null } },
			['name']
		)).map(dbItem => new Region(dbItem._id, dbItem.name, dbItem.countries));
	}
}
