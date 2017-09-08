import { Injectable } from '@angular/core';

import * as XlsxPopulate from 'xlsx-populate';
import { saveAs } from 'file-saver';

@Injectable()
export class XlsxService {

	constructor() { }

	async exportToXlsx<T>(data: T[], filename: string, sheetName: string): Promise<void> {
		const wbook = await XlsxPopulate.fromBlankAsync();
		console.log(XlsxPopulate.MIME_TYPE);
		const wsheet = wbook.sheet(0);
		console.log(wsheet.name());
		wsheet.name('Renamed sheet');
		wsheet.cell(0, 0).value('Here we goooo ooo ooo');
		wsheet.cell(0, 1).value('Go we hereeee eee eee');
		wsheet.cell(0, 0).style({ shrinkToFit: true });
		wsheet.cell(0, 1).style({ wrapText: true });
		// const strOut = await wbook.outputAsync('string');
		// console.log(strOut);
		// const blobOut = await wbook.outputAsync();
		// console.log(blobOut);
		// saveAs(blobOut, filename);
		// const wbout = await wbook.outputAsync('binarystring');
		const buf = await wbook.outputAsync('binarystring');
		console.log(buf);
		// new ArrayBuffer(wbout.length);
		// const view = new Uint8Array(buf);
		// for (let i = 0; i !== wbout.length; ++i) {
		// 	// tslint:disable-next-line:no-bitwise
		// 	view[i] = wbout.charCodeAt(i) & 0xFF;
		// }
		// const wbout = await wbook.outputAsync('blob');
		// const url = window.URL.createObjectURL(wbout);
		// console.log(url);
		// window.open(url);
		saveAs(new Blob([buf]), filename);

		// const wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
		// const worksheet = XLSX.utils.json_to_sheet(data);
		// worksheet['A1'].v = worksheet['A1'].s;
		// const workbook = XLSX.utils.book_new();
		// XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
		// const wbout = <string>XLSX.write(workbook, wopts);
		// const buf = new ArrayBuffer(wbout.length);
		// const view = new Uint8Array(buf);
		// for (let i = 0; i !== wbout.length; ++i) {
		// 	// tslint:disable-next-line:no-bitwise
		// 	view[i] = wbout.charCodeAt(i) & 0xFF;
		// }
		// saveAs(new Blob([buf]), filename);
	}
}
