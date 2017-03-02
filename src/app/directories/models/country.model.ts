import { Entity } from '../../db/entity.model';

export class Country extends Entity {
	name: string;

	constructor(id: string, name: string) {
		if (id.length === 0) {
			throw new Error('Country code must be set');
		}
		if (id.length !== 3) {
			throw new Error('Country code must 3 letters long');
		}
		super(id.toUpperCase());
		this.name = name ? name : '';
	}
}
