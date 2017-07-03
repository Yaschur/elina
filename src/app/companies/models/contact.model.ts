import { Entity } from '../../infra';

export class Contact extends Entity {
	firstName: string;
	lastName: string;
	name: string;
	jobTitle: string;
	jobResponsibilities: string[];
	buyContents: string[];
	sellContents: string[];
	phone: string;
	mobile: string;
	email: string;
	active: boolean;
	created: Date;
	updated: Date;

	constructor(item: any) {
		if (!item.name) {
			throw new Error('Name must be set');
		}
		super(item._id);
		if (!item.firstName && !item.lastName && item.name) {
			const split = (<string>item.name).split(' ', 2);
			this.firstName = split[0];
			this.lastName = split.length > 1 ? split[1] : '';
		} else {
			this.firstName = item.firstName;
			this.lastName = item.lastName;
		}
		this.name = this.firstName + ' ' + this.lastName;
		this.jobTitle = item.jobTitle;
		this.jobResponsibilities = item.jobResponsibilities || [];
		this.buyContents = item.buyContents || [];
		this.sellContents = item.sellContents || [];
		this.phone = item.phone;
		this.mobile = item.mobile;
		this.email = item.email;
		this.active = item.active === undefined ? true : item.active;
		this.created = item.created || new Date();
		this.updated = item.updated || new Date();
	}

	toggleHiring(): void {
		this.active = !this.active;
	}
}
