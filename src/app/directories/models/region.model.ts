import { Entity } from '../../db/entity.model';

export class Region extends Entity {
	name: string;
	countries: string[];

	constructor(item: any) {
		super(item._id && item._id.length > 0 ? item._id : null);
		this.name = item.name ? item.name : '';
		this.countries = item.countries ? item.countries : [];
	}
}
