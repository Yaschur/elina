import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import * as PouchDbFind from 'pouchdb-find';
import * as PouchDbUpsert from 'pouchdb-upsert';

import { ConfigService, Config } from '../config.service';

PouchDB.plugin(PouchDbFind);
PouchDB.plugin(PouchDbUpsert);
PouchDB.debug.disable();

interface VersionInfo {
	readonly dbVersion: number;
}
const VersionInfoId = 'version_info_single';

@Injectable()
export class DbMaintService {

	private static indexes = [
		{ index: { fields: ['type'] } },
		{ index: { fields: ['name'] } },
		{ index: { fields: ['type', 'name'] } }
	];

	private _db: Promise<PouchDB.Database<any>>;
	private _config: Config;

	private static init(db: PouchDB.Database<any>): Promise<PouchDB.Database<any>> {
		const promises = DbMaintService.indexes
			.map(i => db.createIndex(i));
		return Promise.all(promises)
			// .then(() => DbMaintService.getVersion(db))
			// .then(vInfo => {
				// console.log('dbVersion: ' + vInfo.dbVersion);
				// DbMaintService.setVersion(db, vInfo);
			// })
			.then(() => db);
	}

	static async getVersion(trgDb: PouchDB.Database<any>): Promise<VersionInfo> {
		try {
			return await trgDb.get(VersionInfoId);
		} catch (e) {
			console.log(e);
			return { dbVersion: 0 };
		}
	}

	static async setVersion(trgDb: PouchDB.Database<any>, versionInfo: VersionInfo): Promise<void> {
		const itemToStore = <any>Object.assign({}, versionInfo);
		try {
			await trgDb.upsert(VersionInfoId, doc => {
				itemToStore._rev = doc._rev;
				itemToStore._id = doc._id || VersionInfoId;
				itemToStore.type = VersionInfoId;
				return itemToStore;
			});
		} catch (e) {
			console.log('can\'t set version info: ' + e);
		}
	}

	constructor(private _configSrv: ConfigService) {
		this._db = this._configSrv.currentConfig
			.then(config => {
				this._config = config;
				return DbMaintService.init(new PouchDB(this._config.database.nameOrUrl))
			})
			.catch(e => console.log(e));
	}

	get dbInstance(): Promise<PouchDB.Database<any>> {
		return this._db;
	}

	async doBackup(): Promise<void> {
		const srcDb = await this._db;
		if (!this._config.database.backupAllowed) {
			throw new Error('db backup is not allowed by configuration');
		}
		const trgDbName = this._config.database.nameOrUrl + '_backup';
		let trgDb = new PouchDB(trgDbName);
		await trgDb.destroy();
		trgDb = new PouchDB(trgDbName);
		await srcDb.replicate.to(trgDb);
	}

	async doRestore(): Promise<void> {
		let trgDb = await this._db;
		if (!this._config.database.backupAllowed) {
			throw new Error('db restore is not allowed by configuration');
		}
		const srcDbName = this._config.database.nameOrUrl + '_backup';
		const srcDb = new PouchDB(srcDbName);
		await trgDb.destroy();
		trgDb = new PouchDB(this._config.database.nameOrUrl);
		await srcDb.replicate.to(trgDb);
		this._db = DbMaintService.init(trgDb);
	}

	async doExport(): Promise<string> {
		// let skip = 0
		// let limit = 1000
		const db = await this._db;
		const content = (await db.allDocs({ include_docs: true })).rows
			.filter(item => item.doc.type)
			.map(item => {
				delete item.doc._rev;
				return item.doc;
			});
		return JSON.stringify(content);
	}

	async doImport(content: string): Promise<void> {
		let trgDb = await this._db;
		await trgDb.destroy();
		trgDb = new PouchDB(this._config.database.nameOrUrl);
		const items = JSON.parse(content);
		await trgDb.bulkDocs(items);
		this._db = DbMaintService.init(trgDb);
	}

	async doClear(): Promise<void> {
		let trgDb = await this._db;
		await trgDb.destroy();
		trgDb = new PouchDB(this._config.database.nameOrUrl);
		this._db = DbMaintService.init(trgDb);
	}
}
