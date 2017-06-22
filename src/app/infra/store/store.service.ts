import { Injectable } from '@angular/core';

import { DbMaintService } from './db-maint.service';
import { Entity } from '../entity.model';

@Injectable()
export class StoreService {

	private _dbp: Promise<PouchDB.Database<any>>;

	constructor(private _dbService: DbMaintService) {
		this._dbp = this._dbService.dbInstance;
	}

	public async store(type: string, item: any) {
		try {
			const dbItem = this.convertToDb(type, item);
			await (await this._dbp).upsert(dbItem._id, doc => {
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
			const exItem = await (await this._dbp).get(dbId);
			await (await this._dbp).remove(exItem);
		} catch (e) {
			console.log(e);
		}
	}

	public async get(type: string, id: string): Promise<any> {
		try {
			const dbId = this.convertIdToDb(type, id);
			const exItem = await (await this._dbp).get(dbId);
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
			const typeFilter = { type: { $eq: type } };
			const selector = {};
			Object.assign(selector, typeFilter, filter);
			const query: any = {};
			query.selector = selector;
			if (sort) {
				query.sort = sort;
			}
			if (skip) {
				query.skip = skip;
			}
			if (limit) {
				query.limit = limit;
			}
			console.log(query);
			const db = await this._dbp;
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
