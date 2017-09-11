import { Injectable } from '@angular/core';

import * as XlsxPopulate from 'xlsx-populate';
import { saveAs } from 'file-saver';

@Injectable()
export class XlsxService {

	constructor() { }

	async exportToXlsx<T>(data: T[], filename: string, sheetName: string): Promise<void> {
		const wbook = await XlsxPopulate.fromBlankAsync();
		const wsheet = wbook.sheet(0);
		wsheet.name(sheetName);
		const keys = Object.keys(data[0]);
		keys.forEach((key, ind) => wsheet.cell(1, ind + 1).value(key));
		wsheet.row(1).style({ bold: true, horizontalAlignment: 'center' });
		data.forEach((item, r) =>
			keys.forEach((key, ind) =>
				wsheet.cell(r + 2, ind + 1).value(item[key].toString())
			)
		);

		const blobOut = await wbook.outputAsync();
		saveAs(blobOut, filename);
	}
}
