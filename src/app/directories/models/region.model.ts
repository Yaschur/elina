import { Entry } from './entry.model';

export class Region extends Entry {
	countries: string[];

	constructor(item: any) {
		super(item);
		this.countries = item.countries ? item.countries : [];
	}
}
