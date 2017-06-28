import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { DbMaintService } from '../store/db-maint.service';

@Component({
	selector: 'app-db-maintenance',
	templateUrl: './db-maintenance.component.html'
})

export class DbMaintenanceComponent {

	replicationStatus = '';
	transferStatus = '';

	constructor(
		private _electronService: ElectronService,
		private _dbMaintService: DbMaintService,
		private _ngZone: NgZone
	) {
		if (this._electronService.isElectronApp) {

			this._electronService.ipcRenderer.on('file-saved', (event, arg) => {
				console.log('receive file saved: ' + arg);
				this._ngZone.run(() => this.transferStatus = arg ? 'File is not saved: ' + arg : 'File is saved successfully');
			});

			this._electronService.ipcRenderer.on('file-loaded', (event, arg) => {
				console.log('receive file loaded');
				if (arg) {
					this._dbMaintService.doImport(arg)
						.then(() => this._ngZone.run(() => this.replicationStatus = 'File is imported successfully'))
						.then(() => this._electronService.ipcRenderer.send('reload-app'))
						.catch(e => this._ngZone.run(() => this.transferStatus = 'File import failed: ' + e));
				} else {
					this._ngZone.run(() => this.transferStatus = 'File import failed: unknown error');
				}
			});
		}
	}

	backup() {
		this.replicationStatus = 'Database backup is started...';
		this._dbMaintService.doBackup()
			.then(() => this.replicationStatus = 'Database backup is completed')
			.catch(e => this.replicationStatus = 'Database backup error: ' + e);
	}

	restore() {
		this.replicationStatus = 'Database restoring is started...';
		this._dbMaintService.doRestore()
			.then(() => this.replicationStatus = 'Database restoring is completed')
			.then(() => this._electronService.ipcRenderer.send('reload-app'))
			.catch(e => this.replicationStatus = 'Database restoring error: ' + e);
	}

	clear() {
		this.replicationStatus = 'Database clearing is started...';
		this._dbMaintService.doClear()
			.then(() => this.replicationStatus = 'Database clearing is completed')
			.then(() => this._electronService.ipcRenderer.send('reload-app'))
			.catch(e => this.replicationStatus = 'Database clearing error: ' + e);
	}

	export() {
		this.transferStatus = 'File export is started...';
		this._dbMaintService.doExport()
			.then(content => this._electronService.ipcRenderer.send('save-file', content))
			.catch(e => this.transferStatus = 'File export failed: ' + e);
	}
	import() {
		this.transferStatus = 'File import is started...';
		this._electronService.ipcRenderer.send('load-file');
	}
}
