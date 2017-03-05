const electron = require('electron')
const fs = require('fs')
const path = require('path')
const config = require('../config.json')

const dbName = config.database.nameOrUrl;

const fileName = electron.remote.dialog.showOpenDialog({
	filters: [{ extensions: ['json'] }],
	title: 'Choose file to import'
})

if (fileName) {
	const pouchDb = new PouchDB(dbName)
	fs.readFile(fileName, (err, data) =>
		if (err) {
			console.log(err)
		} else {
			pouchDb.destroy()
			pouchDb = new PouchDB(dbName)
			pouchDb.bulkDocs(JSON.parse(data))
				.then(() => electron.ipcRenderer.send('show-app'))
				.catch((e) => console.log(e))
		}
	)
}
else {
	electron.ipcRenderer.send('show-app')
}
