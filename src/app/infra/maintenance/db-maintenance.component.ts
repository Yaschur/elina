import { Component, OnInit } from '@angular/core';
// import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
	selector: 'app-db-maintenance',
	templateUrl: './db-maintenance.component.html'
})

export class DbMaintenanceComponent implements OnInit {
	// info = '';
	constructor(private _electronService: ElectronService) { }

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
}
