import { Entry } from './entry.model';

export class MetaEntry {
	public static Empty: MetaEntry = new MetaEntry('<undef>', '<undef>', null, 'time');

	constructor(
		public singularTitle: string,
		public pluralTitle: string,
		public entryCtor: new (x: any) => Entry,
		public glyphTag: string
	) { }
}
