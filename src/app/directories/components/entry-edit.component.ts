import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { DirEntries } from '../models/dir-entries.model';

import { DirectoryService } from '../services/directory.service';

@Component({
	selector: 'app-entry-edit',
	templateUrl: 'entry-edit.component.html'
})
export class EntryEditComponent implements OnInit {
	private _entryKey = '';

	dirEntries: DirEntries = DirectoryService.dirEntriesEmpty;
	id = '';
	name = '';

	constructor(
		private _dirSrv: DirectoryService,
		private _route: ActivatedRoute,
		private _location: Location
	) { }

	ngOnInit() {
		this._route.params
			.subscribe(params => {
				this._entryKey = params['entry'];
				this.id = params['id'];
				this.dirEntries = this._dirSrv.getDir(this._entryKey);
			});
		this.dirEntries.data
			.subscribe(items => {
				const ind = items.findIndex(e => e._id === this.id);
				if (ind >= 0) {
					this.name = items[ind].name;
				} else {
					this.id = '';
					this.name = '';
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
		if (!this.name.trim()) {
			return;
		}
		const item = new this.dirEntries.meta.entryCtor({ _id: this.id, name: this.name });
		this._dirSrv.storeEntry(this._entryKey, item);
	}
}
