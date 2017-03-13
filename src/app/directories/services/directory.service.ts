import { Injectable } from '@angular/core';
import { MetaEntry } from '../models/meta-entry.model';

import { Country } from '../models/country.model';
import { Region } from '../models/region.model';
import { Activity } from '../models/activity.model';
import { ContentResponsibility } from '../models/content-responsibility.model';
import { RightsResponsibility } from '../models/rights-responsibility.model';
import { JobTitle } from '../models/job-title.model';
import { JobResponsibility } from '../models/job-responsibility.model';

@Injectable()
export class DirectoryService {
	private _metas = {
		'country': new MetaEntry('Country', 'Countries', Country, 'globe'),
		'region': new MetaEntry('Region', 'Regions', Region, 'tags'),
		'activity': new MetaEntry('Activity', 'Activities', Activity, 'dashboard'),
		'contentresponsibility': new MetaEntry('Content Responsibility', 'Content Responsibilities', ContentResponsibility, 'picture'),
		'rightsresponsibility': new MetaEntry('Rights Responsibility', 'Rights Responsibilities', RightsResponsibility, 'briefcase'),
		'jobtitle': new MetaEntry('Job Title', 'Job Titles', JobTitle, 'list-alt'),
		'jobresponsibility': new MetaEntry('Job Responsibility', 'Job Responsibilities', JobResponsibility, 'check')
	};
	constructor() { }

	public getDescriptor(key: string): MetaEntry {
		return this._metas[key] ? this._metas[key] : new MetaEntry('<undef>', '<undef>', null, '');
	}
}
