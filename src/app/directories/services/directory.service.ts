import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MetaEntry } from '../models/meta-entry.model';
import { DirEntries } from '../models/dir-entries.model';

import { Entry } from '../models/entry.model';
import { Country } from '../models/country.model';
import { Region } from '../models/region.model';
import { Activity } from '../models/activity.model';
import { ContentResponsibility } from '../models/content-responsibility.model';
import { RightsResponsibility } from '../models/rights-responsibility.model';
import { JobTitle } from '../models/job-title.model';
import { JobResponsibility } from '../models/job-responsibility.model';

import { DirectoryRepository } from '../repositories/directory.repository';

interface DirMap { [key: string]: DirEntries; };

@Injectable()
export class DirectoryService {

	static dirEntriesEmpty = new DirEntries(MetaEntry.Empty);

	private _dirs: DirMap = {
		'country': new DirEntries(
			new MetaEntry('Country', 'Countries', Country, 'globe')
		),
		'region': new DirEntries(
			new MetaEntry('Region', 'Regions', Region, 'tags')
		),
		'activity': new DirEntries(
			new MetaEntry('Activity', 'Activities', Activity, 'dashboard')
		),
		'contentresponsibility': new DirEntries(
			new MetaEntry('Content Responsibility', 'Content Responsibilities', ContentResponsibility, 'picture')
		),
		'rightsresponsibility': new DirEntries(
			new MetaEntry('Rights Responsibility', 'Rights Responsibilities', RightsResponsibility, 'briefcase')
		),
		'jobtitle': new DirEntries(
			new MetaEntry('Job Title', 'Job Titles', JobTitle, 'list-alt')
		),
		'jobresponsibility': new DirEntries(
			new MetaEntry('Job Responsibility', 'Job Responsibilities', JobResponsibility, 'check')
		)
	};


	constructor(private _dirRepo: DirectoryRepository) {
		for (const key in this._dirs) {
			if (!this._dirs.hasOwnProperty(key)) {
				continue;
			}
			console.log('init ' + key + ' directory data');
			const dir = this._dirs[key];
			_dirRepo.findAll(dir.meta.entryCtor)
				.then(items => dir.setData(items))
				.catch(e => console.log(e));
		}
	}

	public getDir(key: string): DirEntries {
		return this._dirs[key] ? this._dirs[key] : DirectoryService.dirEntriesEmpty;
	}

	public storeEntry(key: string, item: Entry) {
		const org = Object.assign({}, item);
		this._dirRepo.store(item)
			.then(() => this.getDir(key).setItem(org))
			.catch(e => console.log(e));
	}

	public removeEntry(key: string, item: Entry) {
		const org = Object.assign({}, item);
		this._dirRepo.remove(item)
			.then(() => this.getDir(key).clearItem(org))
			.catch(e => console.log(e));
	}
}
