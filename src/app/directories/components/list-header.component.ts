import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'app-list-header',
	templateUrl: 'list-header.component.html'
})
export class ListHeaderComponent {
	@Input() glyphTag: string;
	@Input() title: string;
	@Output() onNew = new EventEmitter();

	constructor() { }

	newItem() {
		this.onNew.emit();
	}
}
