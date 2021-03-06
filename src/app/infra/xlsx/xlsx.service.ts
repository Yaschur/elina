import { Injectable } from '@angular/core';

import * as XlsxPopulate from 'xlsx-populate';
import { saveAs } from 'file-saver';

@Injectable()
export class XlsxService {

	private headers: { [key: string]: any } = {
		'created': {
			value: this.convertDate
		},
		'updated': {
			value: this.convertDate
		},
		'isNew': {
			header: 'new',
			value: this.convertBoolean
		},
		'companyName': {
			header: 'company'
		},
		'firstName': {
			header: 'first name'
		},
		'lastName': {
			header: 'last name'
		},
		'jobResponsibilities': {
			header: 'job responsibilities'
		},
		'buyContents': {
			header: 'buy contents'
		},
		'sellContents': {
			header: 'sell contents'
		},
		'addInfos': {
			header: 'add infos'
		},
		'jobTitle': {
			header: 'job title'
		},
		'active': {
			value: this.convertBoolean
		}
	};

	constructor() { }

	async exportToXlsx<T>(
		data: T[],
		filename: string,
		sheetName: string,
		headers: string[]
	): Promise<void> {
		const wbook = await XlsxPopulate.fromBlankAsync();
		const wsheet = wbook.sheet(0);
		wsheet.name(sheetName);
		headers.forEach((header, ind) => {
			const map = this.headers[header];
			const val = map && map.header ? map.header : header;
			wsheet.cell(1, ind + 1).value(val);
		});
		wsheet.row(1).style({ bold: true, horizontalAlignment: 'center' });
		data.forEach((item, r) =>
			headers.forEach((header, ind) => {
				const map = this.headers[header];
				const val = map && map.value ? map.value(item[header]) : item[header];
				wsheet.cell(r + 2, ind + 1).value(val);
			})
		);

		const blobOut = await wbook.outputAsync();
		saveAs(blobOut, filename);
	}

	async importFromXlsx(data: any): Promise<Array<Array<string>>> {
		const wb = await XlsxPopulate.fromDataAsync(data);
		const arrs = wb
			.activeSheet()
			.usedRange()
			.value();
		return arrs;
	}

	private convertDate(value: Date): string {
		return (new Date(value)).toLocaleString('en-GB');
	}

	private convertBoolean(value: boolean): string {
		return value ? 'yes' : 'no';
	}
}
