import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ElectronService } from 'ngx-electron';

interface Config {
	readonly database: {
		readonly nameOrUrl: string;
		readonly backupAllowed: boolean;
		readonly user?: string;
		readonly password?: string;
	}
}

@Injectable()
export class ConfigService {

	private _current: BehaviorSubject<Config>;

	constructor(private _electronService: ElectronService) {
		this.init();
		this._electronService.ipcRenderer.send('load-config');
	}

	get currentConfig(): Observable<Config> {
		return this._current.asObservable();
	}

	private init() {
		if (this._electronService.isElectronApp) {
			this._electronService.ipcRenderer.on('config-loaded', (event, arg) => {
				console.log('receive config loaded...');
				this._current.next(JSON.parse(arg));
			});
		}
	}
}
