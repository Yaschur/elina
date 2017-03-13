import { Entry } from './entry.model';

export class MetaEntry {
	constructor(
		public singularTitle: string,
		public pluralTitle: string,
		public entryCtor: new (x: any) => Entry,
		public glyphTag: string
	) { }
}
