const electron = require('electron')
const config = require('../config.json')

electron.remote.dialog.showMessageBox({
	title: 'Warning',
	message: 'You are about to clear all the data. This can not be undone. Are you sure?',
	type: 'warning',
	buttons: ['No', 'Yes']
}, (butInd) => {
	if (butInd === 1) {
		const dbName = config.database.nameOrUrl;
		const pouchDb = new PouchDB(dbName)
		pouchDb.destroy()
			.then(() => electron.ipcRenderer.send('show-app'))
			.catch((e) => console.log(e))
	} else {
		electron.ipcRenderer.send('show-app')
	}
})
