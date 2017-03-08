import { Entity } from '../../db/entity.model';

export class Country extends Entity {
	name: string;

	constructor(item: any) {
		if (item._id.length === 0) {
			throw new Error('Country code must be set');
		}
		if (item._id.length !== 3) {
			throw new Error('Country code must 3 letters long');
		}
		item._id = item._id.toUpperCase();
		super(item._id);
		this.name = item.name ? item.name : '';
	}
}
