import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import * as PouchDbFind from 'pouchdb-find';
import * as PouchDbUpsert from 'pouchdb-upsert';

import { ConfigService } from '../config/config.service';
import { Entity } from './entity.model';

PouchDB.plugin(PouchDbFind);
PouchDB.plugin(PouchDbUpsert);
PouchDB.debug.disable();

@Injectable()
export class StoreService {

	private _dbp: Promise<PouchDB.Database<any>>;

	constructor(private _config: ConfigService) {
		this._dbp = new Promise<PouchDB.Database<any>>((resolve, reject) => {
			this._config.currentConfig
				.then(config => {
					const db = new PouchDB(config.database.nameOrUrl);
					// TODO: refactor indexing
					db.createIndex({ index: { fields: ['type'] } })
						.catch((e) => console.log(e));
					db.createIndex({ index: { fields: ['name'] } })
						.catch((e) => console.log(e));
					db.createIndex({ index: { fields: ['type', 'name'] } })
						.catch((e) => console.log(e));
					resolve(db);
				});
		});
	}

	public async createIndex(index: any) {
		try {
			await (await this._dbp).createIndex(index);
		} catch (e) {
			console.log(e);
		}
	}

	public async deleteIndex(index: any) {
		try {
			await (await this._dbp).deleteIndex(index);
		} catch (e) {
			console.log(e);
		}
	}

	public async getIndexes() {
		try {
			return await (await this._dbp).getIndexes();
		} catch (e) {
			console.log(e);
		}
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
