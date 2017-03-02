import { Component } from '@angular/core';

const { version: appVersion } = require('../../package.json');

declare var electron: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	appVersion = 'v';
	constructor() {
		this.appVersion += appVersion;
	}
}
