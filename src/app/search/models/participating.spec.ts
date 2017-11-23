import { ParticipantRepository } from '../../participants';

export class ParticipatingSpec implements Spec {
	private _event: string;
	private _category: string;
	private _status: string;
	private _not: boolean;

	constructor(private _participantRepo: ParticipantRepository, not: boolean = false) {
		this._not = not;
	}

	setParam(event: string, category: string, status: string): ParticipatingSpec {
		this._event = event;
		this._category = category;
		this._status = status;
		return this;
	}

	async provideFilter(): Promise<any> {
		const filter: any[] = [{ event: this._event || { $gt: null } }];
		if (this._category) {
			filter.push({ category: this._category });
		}
		if (this._status) {
			filter.push({ status: this._status });
		}
		// HACK: here - id transformation unknown for domain layer
		const pIds = (await this._participantRepo.FindByFilter(filter.length === 1 ? filter[0] : filter))
			.map(p => 'company_' + p.company);
		return this._not ? { $not: { _id: { $in: pIds } } } : { _id: { $in: pIds } };
	}
}
