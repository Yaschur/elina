export abstract class Entity {
	readonly _id: string;

	constructor(id?: string) {
		this._id = id || this.generateId();
	}

	private generateId(): string {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 8; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	}
}
