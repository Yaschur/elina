import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-edit-header',
	templateUrl: 'edit-header.component.html'
})
export class EditHeaderComponent {
	@Input() glyphTag: string;
	@Input() label: string;
	@Output() onSubmit = new EventEmitter<boolean>();

	constructor() { }

	submit(tosave: boolean) {
		this.onSubmit.emit(tosave);
	}
}
