export abstract class Entity {
	readonly _id: string;
	_rev: string;
	readonly type: string;

	constructor(type: string, id?: string) {
		this._id = id || this.generateId();
		this.type = type;
	}

	private generateId(): string {
		var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
		
	}
}
