import { Injectable } from '@angular/core';

import { CompanyNameQuery } from '../models/company-name.query';
import { ContactNameQuery } from '../models/contact-name.query';
import { ParticipatingQuery } from '../models/participating.query';
import { CountriesQuery } from '../models/countries.query';
import { ParticipantRepository } from '../../participants';
import { DateCreatedQuery } from '../models/date-created.query';

@Injectable()
export class SearchBuilder {
	private _queries: Query[];

	constructor(private _participantRepository: ParticipantRepository) {
		this.reset();
	}

	reset(): void {
		this._queries = [];
	}

	companyNameContains(term: string, remoteMode: boolean): void {
		this._queries.push(
			(new CompanyNameQuery()).setParam(term, remoteMode)
		);
	}
	companyInCountries(terms: string[]): void {
		this._queries.push(
			(new CountriesQuery()).setParam(terms)
		);
	}
	contactNameContains(term: string, remoteMode: boolean): void {
		this._queries.push(
			(new ContactNameQuery()).setParam(term, remoteMode)
		);
	}
	participateIn(term: { event: string, status: string, category: string }) {
		this._queries.push(
			(new ParticipatingQuery(this._participantRepository)).setParam(term.event, term.category, term.status)
		);
	}
	notParticipateIn(term: { event: string, status: string, category: string }) {
		this._queries.push(
			(new ParticipatingQuery(this._participantRepository, true)).setParam(term.event, term.category, term.status)
		);
	}
	createdBetween(term: { from: Date, to: Date }) {
		this._queries.push(
			(new DateCreatedQuery()).setParam(term.from, term.to)
		);
	}

	async build(): Promise<any> {
		const filter = [];
		for (let i = 0; i < this._queries.length; i++) {
			const f = await this._queries[i].provideFilter();
			filter.push(f);
		}
		return filter;
	}
}
