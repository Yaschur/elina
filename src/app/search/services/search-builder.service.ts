import { Injectable } from '@angular/core';

import { CompanyNameSpec } from '../models/company-name.spec';
import { ContactNameSpec } from '../models/contact-name.spec';
import { ParticipatingSpec } from '../models/participating.spec';
import { CountriesSpec } from '../models/countries.spec';
import { ParticipantRepository } from '../../participants';
import { DateCreatedSpec } from '../models/date-created.spec';

@Injectable()
export class SearchBuilder {
	private _specs: Spec[];

	constructor(private _participantRepository: ParticipantRepository) {
		this.reset();
	}

	reset(): void {
		this._specs = [];
	}

	companyNameContains(term: string, remoteMode: boolean): void {
		this._specs.push(
			(new CompanyNameSpec()).setParam(term, remoteMode)
		);
	}
	companyInCountries(terms: string[]): void {
		this._specs.push(
			(new CountriesSpec()).setParam(terms)
		);
	}
	contactNameContains(term: string, remoteMode: boolean): void {
		this._specs.push(
			(new ContactNameSpec()).setParam(term, remoteMode)
		);
	}
	participateIn(term: { event: string, status: string, category: string }) {
		this._specs.push(
			(new ParticipatingSpec(this._participantRepository)).setParam(term.event, term.category, term.status)
		);
	}
	notParticipateIn(term: { event: string, status: string, category: string }) {
		this._specs.push(
			(new ParticipatingSpec(this._participantRepository, true)).setParam(term.event, term.category, term.status)
		);
	}
	createdBetween(term: { from: Date, to: Date }) {
		this._specs.push(
			(new DateCreatedSpec()).setParam(term.from, term.to)
		);
	}

	async build(): Promise<any> {
		const filter = [];
		for (let i = 0; i < this._specs.length; i++) {
			const f = await this._specs[i].provideFilter();
			filter.push(f);
		}
		return filter;
	}
}
