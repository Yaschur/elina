import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Entry } from './models/entry.model';

import { DirectoryRepository } from './repositories/directory.repository';
import { DirectoryService } from './services/directory.service';

@Component({
	moduleId: module.id,
	selector: 'app-entry-edit',
	templateUrl: 'entry-edit.component.html'
})
export class EntryEditComponent implements OnInit {
	entryKey = '';
	meta = DirectoryService.metaEntryEmpty;
	item = { _id: '', name: '' };
	constructor(
		private _dirRepo: DirectoryRepository,
		private _dirSrv: DirectoryService,
		private _route: ActivatedRoute,
		private _location: Location
	) { }

	ngOnInit() {
		this._route.params
			.switchMap(params => {
				this.entryKey = params['entry'];
				const id = params['id'];
				this.meta = this._dirSrv.getMeta(this.entryKey);
				const item = this._dirRepo.getById(this.meta.entryCtor, id);
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
		const item = new this.meta.entryCtor({ _id: this.item._id, name: this.item.name });
		this._dirSrv.storeEntry(this.entryKey, item);
	}
}
