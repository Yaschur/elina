import { Entity } from '../../../infra';

export class Participant extends Entity {
	event: string;
	contact: string;

	constructor(item: any) {
		if (!item.event) {
			throw new Error('Event must be set');
		}
		if (!item.contact) {
			throw new Error('Contact must be set');
		}
		super(item._id);
		this.event = item.event;
		this.contact = item.contact;
	}
}
