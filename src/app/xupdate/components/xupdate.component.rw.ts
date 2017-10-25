import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-xupdate',
	templateUrl: './xupdate.component.html'
})
export class XupdateComponent implements OnInit {
	ngOnInit() {
	}
}

class ImportedItem {
	companyKey: string;
	contactKey: string;
	companyDatas: CompanyData[];
	contactDatas: ContactData[];
}

class CompanyData {
	name: string;
	countryName: string;
	country: string;
	website: string;
}

class ContactData {
	firstName: string;
	lastName: string;
	jobTitle: string;
	phone: string;
	email: string;
}
