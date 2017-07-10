import { Entity } from '../../../infra';

export class Event extends Entity {
	name: string;

	constructor(item: any) {
		if (!item.name) {
			throw new Error('Name must be set');
		}
		super(item._id);
		this.name = item.name;
	}
}
