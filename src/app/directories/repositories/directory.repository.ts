import { Injectable } from '@angular/core';
import { StoreService } from '../../infra/store.service';

@Injectable()
export class DirectoryRepository {

	constructor(private _dbService: StoreService) { }

	public async store<T>(entry: T) {
		await this._dbService.store(this.getTypeName(entry), entry);
	}

	public async remove<T>(entry: T) {
		await this._dbService.remove(this.getTypeName(entry), entry);
	}

	public async getById<T>(ctor: { new (x): T }, id: string): Promise<T> {
		const dbItem = await this._dbService.get(ctor.name.toLowerCase(), id);
		if (!dbItem) {
			return null;
		}
		return new ctor(dbItem);
	}

	public async findAll<T>(ctor: { new (x): T }): Promise<T[]> {
		return (await this._dbService.find(
			ctor.name.toLowerCase(),
			{ name: { $gt: null } },
			['name']
		)).map(dbItem => new ctor(dbItem));
	}

	private getTypeName(item): string {
		return (<any>item).constructor.name.toLowerCase();
	}
}
