import { Entity } from '../../db/entity.model';

export class Region extends Entity {
	name: string;
	countries: string[];
	
	constructor(id: string, name: string, countries?: string[]) {
		super(id && id.length > 0 ? id : null);
		this.name = name ? name : '';
		this.countries = countries ? countries : [];
	}
}