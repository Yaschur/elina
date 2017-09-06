import { CompanyBaseVm } from './company-base-vm.model';
import { ContactBaseVm } from './contact-base-vm.model';

export class CompanyDetailVm extends CompanyBaseVm {
	description: string;
	website: string;
	phone: string;
	created: Date;
	updated: Date;
	notes: {
		created: Date;
		text: string;
	}[];
	activities: string;
	contacts: ContactBaseVm[];
}
