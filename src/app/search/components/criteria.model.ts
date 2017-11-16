class SearchCriteria {
	key: string;
	maxAllowed: number;
	title: string;

	constructor(key: string, maxAllowed: number, title: string) {
		this.key = key;
		this.maxAllowed = maxAllowed;
		this.title = title;
	}
}
class SearchCriteriaManager {
	searchCriterias = [
		new SearchCriteria('companyName', 1, 'by company name'),
		new SearchCriteria('contactName', 1, 'by contact name'),
		new SearchCriteria('participate', 5, 'by participation')
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
