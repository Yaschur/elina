import { Entry } from './entry.model';

export class Country extends Entry {

	constructor(item: any) {
		if (item._id.length === 0) {
			throw new Error('Country code must be set');
		}
		if (item._id.length !== 3) {
			throw new Error('Country code must 3 letters long');
		}
		item._id = item._id.toUpperCase();
		super(item);
	}
}
