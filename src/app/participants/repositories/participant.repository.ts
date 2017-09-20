import { Injectable } from '@angular/core';
import { StoreService } from '../../infra';
import { Participant } from '../models/participant.model';

@Injectable()
export class ParticipantRepository {
	static entityType = 'participant';
	constructor(private _storeService: StoreService) { }

	public async store(participant: Participant) {
		await this._storeService.store(ParticipantRepository.entityType, participant);
	}

	public async remove(participant: Participant) {
		await this._storeService.remove(ParticipantRepository.entityType, participant);
	}

	public async getById(id: string): Promise<Participant> {
		const dbItem = await this._storeService.get(ParticipantRepository.entityType, id);
		if (!dbItem) {
			return null;
		}
		return new Participant(dbItem);
	}

	public async getByAllRefIds(eventId: string, companyId: string, contactId: string): Promise<Participant> {
		const res = (await this._storeService.find(
			ParticipantRepository.entityType,
			{
				$and: [
					{ company: { $eq: companyId } },
					{ contact: { $eq: contactId } },
					{ event: { $eq: eventId } }
				]
			},
			[]
		)).map(dbItem => new Participant(dbItem));
		if (res.length > 1) {
			console.log(
				'more than one participants are found, event: ' + eventId + ', company: ' + companyId + ', contact: ' + contactId
			);
		}

		return res.length > 0 ? res[0] : null;
	}

	public async FindByEvent(eventId: string): Promise<Participant[]> {
		return (await this._storeService.find(
			ParticipantRepository.entityType,
			{ event: { $eq: eventId } },
			[]
		)).map(dbItem => new Participant(dbItem));
	}

	public async FindByCompany(companyId: string): Promise<Participant[]> {
		return (await this._storeService.find(
			ParticipantRepository.entityType,
			{ company: { $eq: companyId } },
			[]
		)).map(dbItem => new Participant(dbItem));
	}

	public async FindByCompanyAndEvent(companyId: string, eventId: string): Promise<Participant[]> {
		return (await this._storeService.find(
			ParticipantRepository.entityType,
			{
				$and: [
					{ company: { $eq: companyId } },
					{ event: { $eq: eventId } }
				]
			},
			[]
		)).map(dbItem => new Participant(dbItem));
	}

	public async FindByContact(companyId: string, contactId: string): Promise<Participant[]> {
		return (await this._storeService.find(
			ParticipantRepository.entityType,
			{
				$and: [
					{ company: { $eq: companyId } },
					{ contact: { $eq: contactId } }
				]
			},
			[]
		)).map(dbItem => new Participant(dbItem));
	}

	public async FindByFilter(filter: any): Promise<Participant[]> {
		return (await this._storeService.find(
			ParticipantRepository.entityType,
			filter,
			[]
		)).map(dbItem => new Participant(dbItem));
	}
}
