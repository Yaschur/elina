import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
	selector: 'app-edit-header',
	templateUrl: 'edit-header.component.html'
})
export class EditHeaderComponent {
	@Input() glyphTag: string;
	@Input() label: string;
	@Output() onSubmit = new EventEmitter<boolean>();
	@Output() onDelete = new EventEmitter();

	modalRef: BsModalRef;

	constructor(
		private _modalService: BsModalService
	) { }

	submit(tosave: boolean) {
		this.onSubmit.emit(tosave);
	}

	deleteConfirmation(template: TemplateRef<any>) {
		this.modalRef = this._modalService.show(template, { keyboard: false, backdrop: false, ignoreBackdropClick: true });
	}
	deleteCancelled() {
		this.modalRef.hide();
		this.modalRef = undefined;
	}
	deleteConfirmed() {
		this.modalRef.hide();
		this.modalRef = undefined;
		this.onDelete.emit();
	}
}
