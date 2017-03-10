import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { Entry } from './models/entry.model';
import { JobResponsibility } from './models/job-responsibility.model';
import { DirectoryRepository } from './repositories/directory.repository';

class Meta {
	constructor(
		public glythTag: string,
		public title: string,
		public entryType: new (x: any) => Entry,
		public entryNameLower: string
	) { }
}

@Component({
	moduleId: module.id,
	selector: 'app-entry-list',
	templateUrl: 'entry-list.component.html',
	providers: [DirectoryRepository]
})
export class EntryListComponent implements OnInit {
	meta = new Meta('time', '', null, '');
	items: Entry[] = [];

	constructor(
		private _repo: DirectoryRepository,
		private _router: Router,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this._route.params
			.switchMap((params: Params) => {
				const entry = params['entry'];
				if (!entry) {
					return null;
				}
				const meta = new Meta('check', 'Job Responsibility', JobResponsibility, entry.toLowerCase());
				return Promise.resolve(meta);
			})
			.subscribe(meta => {
				if (meta != null) {
					this.meta = meta;
					this.findItems();
				}
			});
	}

	findItems() {
		this._repo.findAll<Entry>(this.meta.entryType)
			.then(res => this.items = res);
	}

	gotoEdit(id: string = ''): void {
		this._router.navigate(['directory/country', id]);
		return;
	}

	// static entryMap:	
}
