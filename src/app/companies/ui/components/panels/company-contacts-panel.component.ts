import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyDetailsVm } from '../../models/company-details-vm.model';
import { ContactBaseVm } from '../../models/contact-base-vm.model';

@Component({
	selector: 'app-company-contacts-panel',
	templateUrl: './company-contacts-panel.component.html',
	styleUrls: ['./panels.css']
})

export class CompanyContactsPanelComponent {

	@Input()
	company = new CompanyDetailsVm();
	@Input()
	collapsed = false;
	@Output()
	toggle = new EventEmitter<boolean>();

	includeFired = false;
	checkGlyph = 'unchecked';

	constructor(private _router: Router) { }

	toggleCollapse(): void {
		this.collapsed = !this.collapsed;
		this.toggle.emit(this.collapsed);
	}

	getContacts() {
		return this.company.contacts ? this.company.contacts.filter(c => this.includeFired || c.active) : [];
	}
	addContact(): void {
		this._router.navigate(['contact/edit', this.company.id, '__new__']);
	}
	toggleActive(): void {
		this.includeFired = !this.includeFired;
		this.checkGlyph = this.includeFired ? 'check' : 'unchecked';
	}
	contactDetails(contactId): void {
		this._router.navigate(['contact/details', this.company.id, contactId]);
	}
}
