import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MetaEntry } from '../models/meta-entry.model';

import { Entry } from '../models/entry.model';
import { Country } from '../models/country.model';
import { Region } from '../models/region.model';
import { Activity } from '../models/activity.model';
import { ContentResponsibility } from '../models/content-responsibility.model';
import { RightsResponsibility } from '../models/rights-responsibility.model';
import { JobTitle } from '../models/job-title.model';
import { JobResponsibility } from '../models/job-responsibility.model';

import { DirectoryRepository } from '../repositories/directory.repository';

interface EntryData { [key: string]: Entry[]; };

@Injectable()
export class DirectoryService {

	static metaEntryEmpty = new MetaEntry('<undef>', '<undef>', null, 'time');

	private _metas: { [key: string]: MetaEntry } = {
		'country': new MetaEntry('Country', 'Countries', Country, 'globe'),
		'region': new MetaEntry('Region', 'Regions', Region, 'tags'),
		'activity': new MetaEntry('Activity', 'Activities', Activity, 'dashboard'),
		'contentresponsibility': new MetaEntry('Content Responsibility', 'Content Responsibilities', ContentResponsibility, 'picture'),
		'rightsresponsibility': new MetaEntry('Rights Responsibility', 'Rights Responsibilities', RightsResponsibility, 'briefcase'),
		'jobtitle': new MetaEntry('Job Title', 'Job Titles', JobTitle, 'list-alt'),
		'jobresponsibility': new MetaEntry('Job Responsibility', 'Job Responsibilities', JobResponsibility, 'check')
	};

	private _datas: BehaviorSubject<EntryData> = new BehaviorSubject({});

	constructor(
		private _dirRepo: DirectoryRepository
	) {
		for (const key in this._metas) {
			if (!this._metas.hasOwnProperty(key)) {
				continue;
			}
			console.log('init directory data');
			_dirRepo.findAll(this._metas[key].entryCtor)
				.then(items => {
					const d = this._datas.getValue();
					d[key] = items;
					this._datas.next(d);
				})
				.catch(e => console.log(e));
		}
	}

	get datas() {
		return this._datas.asObservable();
	}

	public getMeta(key: string): MetaEntry {
		return this._metas[key] ? this._metas[key] : DirectoryService.metaEntryEmpty;
	}

	public storeEntry(key: string, item: Entry) {
		const org = Object.assign({}, item);
		this._dirRepo.store(item)
			.then(() => {
				const d = this._datas.getValue();
				const ind = d[key].findIndex(entry => entry._id === org._id);
				if (ind < 0) {
					d[key].push(org);
				} else {
					d[key][ind] = org;
				}
				d[key] = d[key].sort((a, b) => a.name.localeCompare(b.name));
				this._datas.next(d);
			}
			).catch(e => console.log(e));
	}
}
