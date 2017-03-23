import { Entity } from '../../infra/entity.model';
import { Contact } from './contact.model';

export class Company extends Entity {
	name: string;
	country: string;
	city: string;

	contacts: Contact[];

	constructor(item: any) {
		if (!item.name) {
			throw new Error('Name must be set');
		}
		super(item._id);
		this.name = item.name;
		this.country = item.country;
		this.city = item.city;
		this.contacts = item.contacts ? item.contacts : [];
	}
}
