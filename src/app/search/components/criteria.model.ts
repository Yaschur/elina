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
	readonly notParticipateKey = 'notParticipate';

	searchCriterias = [
		new SearchCriteria(this.companyNameKey, 1, 'by company name'),
		new SearchCriteria(this.contactNameKey, 1, 'by contact name'),
		new SearchCriteria(this.participateKey, 5, 'by participation'),
		new SearchCriteria(this.notParticipateKey, 5, 'by NO participation'),
	];
	inUse: string[] = [];

	getAllowedCriterias(): SearchCriteria[] {
		return this.searchCriterias
			.filter(c => c.maxAllowed > this.getInUseKeys().filter(u => u === c.key).length);
	}
	useCriteria(keyName: string): string {
		const sc = this.searchCriterias
			.find(c => c.key === keyName);
		if (!sc || this.getInUseKeys().filter(u => u === keyName).length >= sc.maxAllowed) {
			return;
		}
		const key = keyName + '_' + this.getNextUseId();
		this.inUse.push(key);
		return key;
	}
	removeCriteria(key: string) {
		const ind = this.inUse.findIndex(u => u === key);
		if (ind >= 0) {
			this.inUse.splice(ind, 1);
		}
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
