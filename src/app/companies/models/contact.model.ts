export class Contact {
	name: string;
	phone: string;
	email: string;

	constructor(item: any) {
		if (!item.name) {
			throw new Error('Name must be set');
		}
		this.name = item.name;
		this.phone = item.phone;
		this.email = item.email;
	}
}
