import { Entity } from '../../infra/entity.model';

export class Contact extends Entity {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;

	constructor(item: any) {
		if (!item.firstName || !item.lastName) {
			throw new Error('First and last names must be set');
		}
		super(item._id);
		this.firstName = item.firstName;
		this.lastName = item.lastName;
		this.phone = item.phone;
		this.email = item.email;
	}
}
