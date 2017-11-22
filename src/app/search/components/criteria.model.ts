export class SearchCriteria {
	key: string;
	maxAllowed: number;
	title: string;

	constructor(key: string, maxAllowed: number, title: string) {
		this.key = key;
		this.maxAllowed = maxAllowed;
		this.title = title;
	}
}
export class SearchCriteriaManager {
	readonly companyNameKey = 'companyName';
	readonly contactNameKey = 'contactName';
	readonly participateKey = 'participate';

	searchCriterias = [
		new SearchCriteria(this.companyNameKey, 1, 'by company name'),
		new SearchCriteria(this.contactNameKey, 1, 'by contact name'),
		new SearchCriteria(this.participateKey, 5, 'by participation')
	];
	inUse: string[] = [];

	getAllowedCriterias(): SearchCriteria[] {
		return this.searchCriterias
			.filter(c => c.maxAllowed > this.getInUseKeys().filter(u => u === c.key).length);
	}
	useCriteria(key: string): void {
		const sc = this.searchCriterias
			.find(c => c.key === key);
		if (!sc || this.getInUseKeys().filter(u => u === key).length >= sc.maxAllowed) {
			return;
		}
		this.inUse.push(key + '_' + this.getNextUseId());
	}
	getKeyName(keyInUse: string): string {
		return keyInUse.split('_')[0];
	}
	private getNextUseId(): number {
		return Math.max(0, ...this.getInUseIds()) + 1;
	}
	private getInUseKeys(): string[] {
		return this.inUse.map(s => this.getKeyName(s));
	}
	private getInUseIds(): number[] {
		return this.inUse.map(s => +s.split('_')[1]);
	}
}
