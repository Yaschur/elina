import { Injectable } from '@angular/core';

import { CompanyNameSpec } from '../models/company-name.spec';
import { ContactNameSpec } from '../models/contact-name.spec';
import { ParticipatingSpec } from '../models/participating.spec';
import { ParticipantRepository } from '../../participants';

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
	contactNameContains(term: string, remoteMode: boolean): void {
		this._specs.push(
			(new ContactNameSpec()).setParam(term, remoteMode)
		);
	}
	participateIn(event: string) {
		this._specs.push(
			(new ParticipatingSpec(this._participantRepository)).setParam(event, '', '')
		);
	}
	notParticipateIn(event: string) {
		this._specs.push(
			(new ParticipatingSpec(this._participantRepository, true)).setParam(event, '', '')
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
