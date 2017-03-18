import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Entry } from './entry.model';
import { MetaEntry } from './meta-entry.model';

export class DirEntries {
	private _data: BehaviorSubject<Entry[]>;
	private _meta: MetaEntry;

	constructor(meta: MetaEntry) {
		this._meta = meta;
		this._data = new BehaviorSubject([]);
	}

	get data(): Observable<Entry[]> {
		return this._data.asObservable();
	}

	get meta(): MetaEntry {
		return this._meta;
	}

	setData(items: Entry[]) {
		this._data.next(items);
	}

	setItem(item: Entry) {
		const d = this._data.getValue();
		const ind = d.findIndex(entry => entry._id === item._id);
		if (ind < 0) {
			d.push(item);
		} else {
			d[ind] = item;
		}
		d.sort((a, b) => a.name.localeCompare(b.name));
		this._data.next(d);
	}

	clearItem(item: Entry) {
		const d = this._data.getValue();
		const ind = d.findIndex(entry => entry._id === item._id);
		if (ind >= 0) {
			d.splice(ind, 1);
			this._data.next(d);
		}
	}
}
