import { Injectable } from '@angular/core';
import { StoreService } from '../store/store.service';

@Injectable()
export class UsettingsService {
	static entityType = 'usettings';

	constructor(private _store: StoreService) { }

	async get(key: string): Promise<{}> {
		const usettings = await this._store.get(UsettingsService.entityType, key);
		return usettings ? usettings.value : null;
	}
	set(key: string, value: {}): Promise<void> {
		return this._store.store(UsettingsService.entityType, { _id: key, value: value });
	}
}
