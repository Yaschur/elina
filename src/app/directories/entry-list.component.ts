import { Component, OnInit } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'app-entry-list',
	templateUrl: 'entry-list.component.html'
})
export class EntryListComponent implements OnInit {
	meta = {
		glyphTag: '',
		title: ''
	};

	constructor() { }

	ngOnInit() {
		this.meta = {
			glyphTag: 'asterisk',
			title: 'asterisk'
		};
	}

	gotoEdit(id: string = ''): void {
		// this._router.navigate(['directory/country', id]);
		return;
	}
}
