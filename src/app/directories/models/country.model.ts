import { Entry } from './entry.model';
import { Alpha3 } from './alpha3.model';

export class Country extends Entry {

	constructor(item: any) {
		if (!item._id && !item.name) {
			throw new Error('Country code or name must be set');
		}
		if (!item._id) {
			const alphaItem = Alpha3.arrs.find(a => a.name.toLowerCase() === item.name.toLowerCase());
			if (alphaItem) {
				item._id = alphaItem.alpha3;
			} else {
				throw new Error('Country code must be set');
			}
		}
		if (item._id.length !== 3) {
			throw new Error('Country code must 3 letters long');
		}

		item._id = item._id.toUpperCase();
		super(item);
	}
}
