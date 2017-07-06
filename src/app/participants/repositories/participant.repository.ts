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

	// public async findAll(): Promise<Participant[]> {
	// 	return (await this._storeService.find(
	// 		ParticipantRepository.entityType,
	// 		{ name: { $gt: null } },
	// 		['name']
	// 	)).map(dbItem => new Participant(dbItem));
	// }
}
