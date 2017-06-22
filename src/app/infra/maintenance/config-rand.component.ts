import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
	selector: 'app-config-rand',
	templateUrl: './config-rand.component.html'
})

export class ConfigComponent implements OnInit {
	info = '';
	constructor(private _electronService: ElectronService, private _ngZone: NgZone) { }

	ngOnInit() {
		if (this._electronService.isElectronApp) {
			this._electronService.ipcRenderer.on('config-loaded', (event, arg) => {
				this._ngZone.run(() => {
					this.info = arg;
				});
			});
		}
		this._electronService.ipcRenderer.send('load-config');
	}
}
