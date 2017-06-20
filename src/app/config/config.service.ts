import { Injectable } from '@angular/core';

interface Config {
	database: {
		nameOrUrl: string;
		backupAllowed: boolean;
		user?: string;
		password?: string;
	}
}

@Injectable()
export class ConfigService {

	constructor() { }
}
