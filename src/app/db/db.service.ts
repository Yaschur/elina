import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import * as PouchDbFind from 'pouchdb-find';
import * as PouchDbUpsert from 'pouchdb-upsert';

import { Entity } from './entity.model';

PouchDB.plugin(PouchDbFind);
PouchDB.plugin(PouchDbUpsert);
// PouchDB.debug.enable('pouchdb:find');
const MAIN_DB_NAME = 'elina_db';

@Injectable()
export class DbService {

	private _db: PouchDB.Database<any>;

	constructor() {
		this._db = new PouchDB(MAIN_DB_NAME);
		// TODO: refactor indexing
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
	}

	public async find(filter: any, sort: any[]): Promise<any[]> {
		// await this._db.createIndex({ index: { fields: ['phone', 'type'] } })
		// 	.catch((e) => console.log(e));
		const res = await this._db.find({
			selector: filter,
			sort: sort,
			limit: 100
		}).catch((e) => { console.log(e); return null; });
		// console.log(res);
		return res ? res.docs : [];
	}

	private convertIdToDb(type: string, id: string) {
		return type + '_' + id;
	}

	private convertToDb(type: string, item: any): any {
		item._id = this.convertIdToDb(type, item._id);
		item.type = type;
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
