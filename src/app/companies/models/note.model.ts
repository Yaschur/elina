export class Note {
	created: Date;
	text: string;

	constructor(item: any) {
		if (!item.text) {
			throw new Error('Text must be set');
		}
		this.created = item.created || new Date();
		this.text = item.text;
	}
}
