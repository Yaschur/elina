import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyDetailsVm } from '../../models/company-details-vm.model';

@Component({
	selector: 'app-company-info-panel',
	templateUrl: './company-info-panel.component.html',
	styleUrls: ['./panels.css']
})

export class CompanyInfoPanelComponent {

	@Input()
	company = new CompanyDetailsVm();
	@Input()
	collapsed = false;
	@Output()
	toggle = new EventEmitter<boolean>();

	constructor(private _router: Router) { }

	gotoEdit(): void {
		this._router.navigate(['company/edit', this.company.id]);
	}
	toggleCollapse(): void {
		this.collapsed = !this.collapsed;
		this.toggle.emit(this.collapsed);
	}
}
