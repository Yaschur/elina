import { Entity } from '../../infra';

export class Participant extends Entity {
	event: string;
	company: string;
	contact: string;
	category: string;
	status: string;

	registrationFee: string;
	freeNights: string;
	arrivalDate: Date;
	departureDate: Date;
	visaRequired: boolean;
	participantValidated: boolean;

	created: Date;
	updated: Date;

	constructor(item: any) {
		if (!item.event) {
			throw new Error('Event must be set');
		}
		if (!item.company) {
			throw new Error('Company must be set');
		}
		if (!item.contact) {
			throw new Error('Contact must be set');
		}
		if (!item.category) {
			throw new Error('Category must be set');
		}
		if (!item.status) {
			throw new Error('Status must be set');
		}
		super(item._id);
		this.event = item.event;
		this.company = item.company;
		this.contact = item.contact;
		this.category = item.category;
		this.status = item.status;

		this.registrationFee = item.registrationFee;
		this.freeNights = item.freeNights;
		this.arrivalDate = item.arrivalDate;
		this.departureDate = item.departureDate;
		this.visaRequired = item.visaRequired === undefined ? false : item.visaRequired;
		this.participantValidated = item.participantValidated === undefined ? false : item.participantValidated;

		this.created = item.created || new Date();
		this.updated = item.updated || new Date();
	}
}
