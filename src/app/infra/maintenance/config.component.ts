import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { ConfigService } from '../config.service';

@Component({
	selector: 'app-config',
	templateUrl: './config.component.html'
})
export class ConfigComponent implements OnInit {

	configForm: FormGroup;

	constructor(
		private _fb: FormBuilder,
		private _configSrv: ConfigService,
		private _location: Location
	) {
		this.createForm();
	}

	ngOnInit() {
		this._configSrv.currentConfig
			.then(config => this.configForm.setValue({
				database: {
					nameOrUrl: config.database.nameOrUrl,
					backupAllowed: config.database.backupAllowed ? 'yes' : 'no',
					user: config.database.user || '',
					password: config.database.password || ''
				}
			}));
	}

	onCancel() {
		this._location.back();
	}

	onSubmit() {
		const config: any = { database: {} };
		config.database.nameOrUrl = this.configForm.get('database.nameOrUrl').value.trim();
		config.database.backupAllowed = this.configForm.get('database.backupAllowed').value === 'yes' ? true : false;
		const user = this.configForm.get('database.user').value.trim();
		if (user) {
			config.database.user = user;
		}
		const password = this.configForm.get('database.password').value.trim();
		if (password) {
			config.database.password = password;
		}
		this._configSrv.setConfig(config);
		this.configForm.markAsPristine();
	}

	private createForm() {
		this.configForm = this._fb.group({
			database: this._fb.group({
				nameOrUrl: ['', Validators.required],
				backupAllowed: 'yes',
				user: '',
				password: ''
			})
		});
	}

}
