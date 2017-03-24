import { Entity } from '../../infra/entity.model';
import { Contact } from './contact.model';
import { Note } from './note.model';

export class Company extends Entity {
	name: string;
	description: string;
	country: string;
	city: string;
	activities: string[];
	phone: string;
	website: string;
	created: Date;
	updated: Date;

	notes: Note[];
	contacts: Contact[];

	constructor(item: any) {
		if (!item.name) {
			throw new Error('Name must be set');
		}
		super(item._id);
		this.name = item.name;
		this.description = item.description;
		this.country = item.country;
		this.city = item.city;
		this.activities = item.activities || [];
		this.phone = item.phone;
		this.website = item.website;
		this.created = item.created || new Date();
		this.updated = item.updated || new Date();

		this.notes = item.notes || [];
		this.contacts = item.contacts || [];
	}
}
