import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MetaEntry } from '../models/meta-entry.model';
import { DirEntries } from '../models/dir-entries.model';

import { Entry } from '../models/entry.model';
import { Country } from '../models/country.model';
import { Region } from '../models/region.model';
import { Activity } from '../models/activity.model';
import { ContentResponsibility } from '../models/content-responsibility.model';
import { JobResponsibility } from '../models/job-responsibility.model';
import { ParticipantCategory } from '../models/participant-category.model';
import { ParticipantStatus } from '../models/participant-status.model';

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
		'jobresponsibility': new DirEntries(
			new MetaEntry('Job Responsibility', 'Job Responsibilities', JobResponsibility, 'check')
		),
		'participantcategory': new DirEntries(
			new MetaEntry('Participant Category', 'Participant Categories', ParticipantCategory, 'queen')
		),
		'participantstatus': new DirEntries(
			new MetaEntry('Participant Status', 'Participant Statuses', ParticipantStatus, 'list-alt')
		)
	};


	constructor(private _dirRepo: DirectoryRepository) {
		this.init();
	}

	public init() {
		for (const key in this._dirs) {
			if (!this._dirs.hasOwnProperty(key)) {
				continue;
			}
			console.log('init ' + key + ' directory data');
			const dir = this._dirs[key];
			this._dirRepo.findAll(dir.meta.entryCtor)
				.then(items => dir.setData(items))
				.catch(e => console.log(e));
		}
	}

	public purge() {
		for (const key in this._dirs) {
			if (!this._dirs.hasOwnProperty(key)) {
				continue;
			}
			const dir = this._dirs[key];
			dir.setData([]);
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
