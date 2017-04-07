import { Entity } from '../../infra/entity.model';

export class Contact extends Entity {
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
		this.name = item.name;
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
