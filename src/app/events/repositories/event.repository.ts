import { Injectable } from '@angular/core';
import { StoreService } from '../../infra';
import { Event } from '../models/event.model';

@Injectable()
export class EventRepository {
	static entityType = 'event';
	constructor(private _storeService: StoreService) { }

	public async store(event: Event) {
		await this._storeService.store(EventRepository.entityType, event);
	}

	public async remove(event: Event) {
		await this._storeService.remove(EventRepository.entityType, event);
	}

	public async getById(id: string): Promise<Event> {
		const dbItem = await this._storeService.get(EventRepository.entityType, id);
		if (!dbItem) {
			return null;
		}
		return new Event(dbItem);
	}

	public async findAll(): Promise<Event[]> {
		return (await this._storeService.find(
			EventRepository.entityType,
			{ name: { $gt: null } },
			['name']
		)).map(dbItem => new Event(dbItem));
	}
}
