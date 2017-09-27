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
	};
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
		return this._current.asObservable().toPromise();
	}

	public setConfig(config: Config): void {
		this._electronService.ipcRenderer.send('save-config', JSON.stringify(config));
	}

	private init() {
		if (this._electronService.isElectronApp) {

			this._electronService.ipcRenderer.on('config-loaded', (event, arg) => {
				console.log('receive config loaded: ' + arg);
				if (!arg) {
					this.makeDefaultConfig();
					return;
				}
				if (this._current.isStopped) {
					this._current = new AsyncSubject<Config>();
				}
				this._current.next(JSON.parse(arg));
				this._current.complete();
			});

			this._electronService.ipcRenderer.on('config-saved', (event, arg) => {
				console.log('receive config saved: ' + arg);
				if (!arg) {
					// TODO: live config is not working
					// this.reload();
					this._electronService.ipcRenderer.send('reload-app');
				}
			});
		}
	}

	private reload() {
		if (this._current.isStopped) {
			this._current = new AsyncSubject<Config>();
		}
		this._electronService.ipcRenderer.send('load-config');
	}

	private makeDefaultConfig() {
		const config = <Config>{
			database: {
				nameOrUrl: 'elina_db',
				backupAllowed: true
			}
		};
		this.setConfig(config);
	}
}
