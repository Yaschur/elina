import { Injectable } from '@angular/core';

import { DbMaintService } from './db-maint.service';
import { Entity } from '../entity.model';

@Injectable()
export class StoreService {

	static utils = {
		escapeForRegex: function (inTerm: string) {
			return inTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		}
	};

	constructor(private _dbService: DbMaintService) { }

	async checkRemoteMode(): Promise<boolean> {
		await this._dbService.dbInstance;
		return this._dbService.checkRemoteMode();
	}

	public async store(type: string, item: any) {
		try {
			const dbItem = this.convertToDb(type, item);
			await (await this._dbService.dbInstance).upsert(dbItem._id, doc => {
				dbItem._rev = doc._rev;
				console.log(dbItem);
				return dbItem;
			});
		} catch (e) {
			console.log(e);
		}
	}

	public async remove(type: string, item: any) {
		try {
			const dbId = this.convertIdToDb(type, item._id);
			const exItem = await (await this._dbService.dbInstance).get(dbId);
			await (await this._dbService.dbInstance).remove(exItem);
		} catch (e) {
			console.log(e);
		}
	}

	public async get(type: string, id: string): Promise<any> {
		try {
			const dbId = this.convertIdToDb(type, id);
			const exItem = await (await this._dbService.dbInstance).get(dbId);
			return this.convertToDomain(exItem);
		} catch (e) {
			console.log(e);
		}
		return null;
	}

	public async find(
		type: string,
		filter: any,
		sort?: any[],
		skip?: number,
		limit?: number
	): Promise<any[]> {
		try {
			const typeFilter = [{ type: { $eq: type } }];
			const query: any = { selector: { $and: [] } };
			if (filter.$and) {
				query.selector.$and = typeFilter.concat(filter.$and);
			} else if (Array.isArray(filter)) {
				query.selector.$and = typeFilter.concat(filter);
			} else {
				query.selector.$and = typeFilter;
				query.selector.$and.push(filter);
			}
			query.sort = ['type'];
			if (sort) {
				query.sort = query.sort.concat(sort);
			}
			if (skip) {
				query.skip = skip;
			}
			// HACK: set explicit limit because couchdb 2.0 has default by 25
			query.limit = limit || 10000;
			console.log(query);
			const db = await this._dbService.dbInstance;
			const res = await db.find(query);
			console.log(res);
			const items: any[] = [];
			res.docs.forEach(doc => {
				const item = this.convertToDomain(doc);
				items.push(item);
			});
			return items;
		} catch (e) {
			console.log(e);
		}
		return [];
	}

	private convertIdToDb(type: string, id: string) {
		return type + '_' + id;
	}
	private convertToDb(type: string, item: any): any {
		const itemToStore = Object.assign({}, item);
		itemToStore._id = this.convertIdToDb(type, itemToStore._id);
		itemToStore.type = type;
		return itemToStore;
	}
	private convertIdToDomain(item: any): string {
		return item._id.split('_')[1];
	}
	private convertToDomain(item: any): any {
		item._id = this.convertIdToDomain(item);
		delete item.type;
		delete item._rev;
		return item;
	}

}
