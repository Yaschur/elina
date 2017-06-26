import { Component, OnInit } from '@angular/core';
// import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { DbMaintService } from '../store/db-maint.service';

@Component({
	selector: 'app-db-maintenance',
	templateUrl: './db-maintenance.component.html'
})

export class DbMaintenanceComponent implements OnInit {

	replicationStatus = '';
	transferStatus = '';

	constructor(
		private _electronService: ElectronService,
		private _dbMaintService: DbMaintService
	) { }

	ngOnInit() {
		if (this._electronService.isElectronApp) {
			// this._electronService.ipcRenderer.on('config-loaded', (event, arg) => {
			// 	this._ngZone.run(() => {
			// 		this.info = arg;
			// 	});
			// });
		}
		// this._electronService.ipcRenderer.send('load-config');
	}

	backup() {
		this.replicationStatus = 'Database backup is started...';
		this._dbMaintService.doBackup()
			.then(() => this.replicationStatus = 'Database backup is completed.')
			.catch(e => this.replicationStatus = 'Database backup error:' + e);
	}

	restore() {
		this.replicationStatus = 'Database restoring is started...';
		this._dbMaintService.doRestore()
			.then(() => this.replicationStatus = 'Database restoring is completed.')
			.catch(e => this.replicationStatus = 'Database restoring error:' + e);
	}

	clear() {
		this.replicationStatus = 'Database clearing is started...';
		this._dbMaintService.doClear()
			.then(() => this.replicationStatus = 'Database clearing is completed.')
			.catch(e => this.replicationStatus = 'Database clearing error:' + e);
	}
}