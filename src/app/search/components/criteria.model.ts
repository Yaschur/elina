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
			.filter(c => c.maxAllowed > this.inUse.filter(u => u === c.key).length);
	}
	useCriteria(key: string): void {
		const sc = this.searchCriterias
			.find(c => c.key === key);
		if (!sc || this.inUse.filter(u => u === key).length >= sc.maxAllowed) {
			return;
		}
		this.inUse.push(key);
	}
}
