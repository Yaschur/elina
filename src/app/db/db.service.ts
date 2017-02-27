import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import * as PouchDbFind from 'pouchdb-find';
import * as PouchDbUpsert from 'pouchdb-upsert';

import { Entity } from './entity.model';

PouchDB.plugin(PouchDbFind);
PouchDB.plugin(PouchDbUpsert);
//PouchDB.debug.enable('pouchdb:find');
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
		} catch(e) {
			console.log(e);
		}
	}

	public async deleteIndex(index: any) {
		try {
			await this._db.deleteIndex(index);
		} catch(e) {
			console.log(e);
		}
	}

	public async getIndexes() {
		try {
			return await this._db.getIndexes();
		} catch(e) {
			console.log(e);
		}
	}

	public async store<T extends Entity>(item: T) {
		try {
		var id = item.type + '_' + item._id;
		this._db.upsert(id, doc => {
			//item
		})
		} catch(e) {
			console.log(e);
		}


		const exItem = await this._db.get(item._id)
			.catch(() => null);
		if (exItem && exItem.type == item.type) {
			item._rev = exItem._rev;
		}
		await this._db.put(item);
	}

	// let id = req.params.type + '_' + req.params.id;
	// 	pouchDb.upsert(id, doc => {
	// 		let item = req.body;
	// 		item._id = id;
	// 		item._rev = doc._rev;
	// 		return item;

	public async remove<T extends Entity>(item: T) {
		const exItem = await this._db.get(item._id)
			.catch(() => null);
		if (exItem && exItem.type == item.type) {
			await this._db.remove(exItem._id, exItem._rev);
		}
	}

	public async get(type: string, id: string): Promise<any> {
		const exItem = await this._db.get(id)
			.catch((e) => { console.log(e); return null; });
		return exItem != null && exItem.type == type ? exItem : null;
	}

	public async find(filter: any, sort: any[]): Promise<any[]> {
		// await this._db.createIndex({ index: { fields: ['phone', 'type'] } })
		// 	.catch((e) => console.log(e));
		let res = await this._db.find({
			selector: filter,
			sort: sort,
			limit: 100
		}).catch((e) => { console.log(e); return null; });
		//console.log(res);
		return res ? res.docs : [];
	}
}
