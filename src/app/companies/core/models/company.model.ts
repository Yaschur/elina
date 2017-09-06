import { Entity } from '../../../infra';
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
	notes: Note[];
	contacts: Contact[];

	created: Date;
	updated: Date;

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

		this.notes = (item.notes || []).map(n => new Note(n));
		this.contacts = (item.contacts || []).map(c => new Contact(c));
	}

	getContactById(id: string): Contact {
		const contInd = this.contacts
			.findIndex(c => c._id === id);
		if (contInd < 0) {
			return null;
		}
		return this.contacts[contInd];
	}
}
