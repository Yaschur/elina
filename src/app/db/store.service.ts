import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import * as PouchDbFind from 'pouchdb-find';
import * as PouchDbUpsert from 'pouchdb-upsert';

import { Entity } from './entity.model';

PouchDB.plugin(PouchDbFind);
PouchDB.plugin(PouchDbUpsert);
// PouchDB.debug.disable();
const MAIN_DB_NAME = 'elina_db';

@Injectable()
export class StoreService {

	private _db: PouchDB.Database<any>;

	constructor() {
		this._db = new PouchDB(MAIN_DB_NAME, {auto_compaction: true});
		// TODO: refactor indexing
		this._db.createIndex({ index: { fields: ['type'] } })
			.catch((e) => console.log(e));
		this._db.createIndex({ index: { fields: ['name'] } })
			.catch((e) => console.log(e));
		this._db.createIndex({ index: { fields: ['type', 'name'] } })
			.catch((e) => console.log(e));
	}

	public async createIndex(index: any) {
		try {
			await this._db.createIndex(index);
		} catch (e) {
			console.log(e);
		}
	}

	public async deleteIndex(index: any) {
		try {
			await this._db.deleteIndex(index);
		} catch (e) {
			console.log(e);
		}
	}

	public async getIndexes() {
		try {
			return await this._db.getIndexes();
		} catch (e) {
			console.log(e);
		}
	}

	public async store(type: string, item: any) {
		try {
			const dbItem = this.convertToDb(type, item);
			await this._db.upsert(dbItem._id, doc => {
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
			const exItem = await this._db.get(dbId);
			await this._db.remove(exItem);
		} catch (e) {
			console.log(e);
		}
	}

	public async get(type: string, id: string): Promise<any> {
		try {
			const dbId = this.convertIdToDb(type, id);
			const exItem = await this._db.get(dbId);
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
			const res = await this._db.find(query);
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
		console.log(item);
		item._id = this.convertIdToDb(type, item._id);
		item.type = type;
		console.log(item);
		return item;
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
