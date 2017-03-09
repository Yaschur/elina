import { Entity } from '../../db/entity.model';

export abstract class Entry extends Entity {
	name: string;
	constructor(item: any) {
		super(item._id && item._id.length > 0 ? item._id : null);
		this.name = item.name ? item.name : '';
	}
}
