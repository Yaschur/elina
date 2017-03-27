export class Contact {
	name: string;
	phone: string;
	email: string;
	active: boolean;

	constructor(item: any) {
		if (!item.name) {
			throw new Error('Name must be set');
		}
		this.name = item.name;
		this.phone = item.phone;
		this.email = item.email;
		this.active = item.active;
	}
}
