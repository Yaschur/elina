import { Entity } from '../../infra';

export class Event extends Entity {
	name: string;
	description: string;

	country: string;
	city: string;
	location: string;

	start: Date;
	end: Date;

	categories: string[];

	constructor(item: any) {
		if (!item.name) {
			throw new Error('Name must be set');
		}
		super(item._id);
		this.name = item.name;
		this.description = item.description;
		this.country = item.country;
		this.city = item.city;
		this.location = item.location;
		this.start = item.start;
		this.end = item.end;
		this.categories = item.categories || [];
	}
}
