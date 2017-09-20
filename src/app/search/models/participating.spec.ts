import { ParticipantRepository } from '../../participants';

export class ParticipatingSpec implements Spec {
	private _event: string;
	private _category: string;
	private _status: string;

	constructor(private _participantRepo: ParticipantRepository) {
	}

	setParam(event: string, category: string, status: string): ParticipatingSpec {
		this._event = event;
		this._category = category;
		this._status = status;
		return this;
	}

	async provideFilter(): Promise<any> {
		const filter: any = { event: this._event || { $gt: null } };
		if (this._category) {
			filter.category = this._category;
		}
		if (this._status) {
			filter.status = this._status;
		}
		// HACK: here - id transformation unknown for domain layer
		const pIds = (await this._participantRepo.FindByFilter(filter))
			.map(p => 'company_' + p.company);
		return { _id: { $in: pIds } };
	}
}
