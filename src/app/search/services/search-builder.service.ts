import { CompanyNameSpec } from '../specs/company-name.spec';
import { ContactNameSpec } from '../specs/contact-name.spec';

export class SearchBuilder {
	private _specs: Spec[];

	constructor() {
		this.reset();
	}

	reset(): void {
		this._specs = [];
	}

	companyNameContains(term: string): void {
		this._specs.push(
			new CompanyNameSpec(term)
		);
	}
	contactNameContains(term: string): void {
		this._specs.push(
			new ContactNameSpec(term)
		);
	}

	build(): any {
		const filter = [];
		this._specs.forEach(s => filter.push(s.provideFilter()));
		return filter;
	}
}
