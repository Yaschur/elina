import { ContactBaseVm } from './contact-base-vm.model';

export class ContactDetailVm extends ContactBaseVm {
	firstName: string;
	lastName: string;
	phone: string;
	mobile: string;
	email: string;
	created: Date;
	updated: Date;
	jobResponsibilities: string;
	buyContents: string;
	sellContents: string;
	addInfos: string;
}
