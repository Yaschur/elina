import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Entry } from './models/entry.model';
import { JobResponsibility } from './models/job-responsibility.model';
import { JobTitle } from './models/job-title.model';
import { DirectoryRepository } from './repositories/directory.repository';

class Meta {
	constructor(
		public glyphTag: string,
		public title: string,
		public entryType: new (x: any) => Entry,
		public entryName: string
	) { }
}

@Component({
	moduleId: module.id,
	selector: 'app-entry-edit',
	templateUrl: 'entry-edit.component.html',
	providers: [DirectoryRepository]
})
export class EntryEditComponent implements OnInit {
	static entryMap = {
		'jobresponsibility': new Meta('check', 'Job Responsibility', JobResponsibility, 'jobresponsibility'),
		'jobtitle': new Meta('list-alt', 'Job Title', JobTitle, 'jobtitle')
	};
	meta = new Meta('time', '', null, '');
	item = { _id: '', name: '' };
	constructor(
		private _repo: DirectoryRepository,
		private _route: ActivatedRoute,
		private _location: Location
	) { }

	ngOnInit() {
		this._route.params
			.switchMap(params => {
				const entry = params['entry'];
				const id = params['id'];
				this.meta = EntryEditComponent.entryMap[entry];
				const item = this._repo.getById(this.meta.entryType, id);
				return item;
			})
			.subscribe(item => {
				if (item) {
					this.item._id = item._id;
					this.item.name = item.name;
				}
			});
	}

	submit(save: boolean) {
		if (save) {
			this.save();
		}
		this._location.back();
	}

	private save(): void {
		if (!this.item.name.trim()) {
			return;
		}
		const item = new this.meta.entryType({ _id: this.item._id, name: this.item.name });
		this._repo.store(item);
	}
}
