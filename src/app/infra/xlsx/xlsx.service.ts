import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable()
export class XlsxService {

	constructor() { }

	exportToXlsx<T>(data: T[], filename: string, sheetName: string): void {
		const wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
		const wbout = <string>XLSX.write(workbook, wopts);
		const buf = new ArrayBuffer(wbout.length);
		const view = new Uint8Array(buf);
		for (let i = 0; i !== wbout.length; ++i) {
			// tslint:disable-next-line:no-bitwise
			view[i] = wbout.charCodeAt(i) & 0xFF;
		}
		saveAs(new Blob([buf]), filename);
	}
}
