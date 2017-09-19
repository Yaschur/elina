import { ContactBaseVm } from './contact-base-vm.model';

export class ContactCompanyBaseVm extends ContactBaseVm {
	companyId: string;
	companyName: string;
	country: string;
}
