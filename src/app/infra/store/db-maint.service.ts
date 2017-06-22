import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import * as PouchDbFind from 'pouchdb-find';
import * as PouchDbUpsert from 'pouchdb-upsert';

import { ConfigService } from '../config.service';

PouchDB.plugin(PouchDbFind);
PouchDB.plugin(PouchDbUpsert);
PouchDB.debug.disable();

@Injectable()
export class DbMaintService {

	private static indexes = [
		{ index: { fields: ['type'] } },
		{ index: { fields: ['name'] } },
		{ index: { fields: ['type', 'name'] } }
	]

	private _db: Promise<PouchDB.Database<any>>;

	private static init(db: PouchDB.Database<any>): Promise<PouchDB.Database<any>> {
		const promises = DbMaintService.indexes
			.map(i => db.createIndex(i));
		return Promise.all(promises)
			.then(() => db);
	}

	constructor(private _config: ConfigService) {
		this._db = _config.currentConfig
			.then(config => DbMaintService.init(new PouchDB(config.database.nameOrUrl)))
			.catch(e => console.log(e));
	}

	get dbInstance(): Promise<PouchDB.Database<any>> {
		return this._db;
	}
}
