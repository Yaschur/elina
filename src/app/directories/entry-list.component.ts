import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { Entry } from './models/entry.model';
import { JobResponsibility } from './models/job-responsibility.model';
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
	selector: 'app-entry-list',
	templateUrl: 'entry-list.component.html',
	providers: [DirectoryRepository]
})
export class EntryListComponent implements OnInit {
	static entryMap = {
		'jobresponsibility': new Meta('check', 'Job Responsibility', JobResponsibility, 'jobresponsibility'),
		'jobtitle': new Meta('check', 'Job Responsibility', JobResponsibility, 'jobresponsibility')
	};
	meta = new Meta('time', '', null, '');
	items: Entry[] = [];

	constructor(
		private _repo: DirectoryRepository,
		private _router: Router,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this._route.params
			.subscribe(params => {
				const entry = params['entry'];
				this.meta = EntryListComponent.entryMap[entry];
				this.findItems();
			});
	}

	findItems() {
		this._repo.findAll<Entry>(this.meta.entryType)
			.then(res => this.items = res);
	}

	gotoEdit(id: string = ''): void {
		this._router.navigate(['directory/' + this.meta.entryName, id]);
		return;
	}
}
