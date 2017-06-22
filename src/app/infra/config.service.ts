import { Injectable, NgZone } from '@angular/core';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { ElectronService } from 'ngx-electron';

export interface Config {
	readonly database: {
		readonly nameOrUrl: string;
		readonly backupAllowed: boolean;
		readonly user?: string;
		readonly password?: string;
	}
}

@Injectable()
export class ConfigService {

	private _current: AsyncSubject<Config>;

	constructor(private _electronService: ElectronService) {
		this._current = new AsyncSubject<Config>();
		this.init();
		this.reload();
	}

	get currentConfig(): Promise<Config> {
		return this._current.toPromise();
	}

	public reload() {
		if (this._current.isStopped) {
			this._current = new AsyncSubject<Config>();
		}
		this._electronService.ipcRenderer.send('load-config');
	}

	private init() {
		if (this._electronService.isElectronApp) {
			this._electronService.ipcRenderer.on('config-loaded', (event, arg) => {
				console.log('receive config loaded: ' + arg);
				if (this._current.isStopped) {
					this._current = new AsyncSubject<Config>();
				}
				this._current.next(JSON.parse(arg));
				this._current.complete();
			});
		}
	}
}
