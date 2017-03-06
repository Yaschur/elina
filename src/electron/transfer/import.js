const electron = require('electron')
const fs = require('fs')
const path = require('path')
const config = require('../config.json')

const dbName = config.database.nameOrUrl

const fileName = electron.remote.dialog.showOpenDialog({
	filters: [{ name: 'data', extensions: ['json'] }],
	title: 'Choose file to import'
})
console.log(fileName)
if (fileName) {
	let pouchDb = new PouchDB(dbName)
	fs.readFile(fileName[0], (err, data) => {
		if (err) {
			console.log(err)
		} else {
			pouchDb.destroy()
			pouchDb = new PouchDB(dbName)
			pouchDb.bulkDocs(JSON.parse(data))
				.then(() => console.log('d')) //electron.ipcRenderer.send('show-app'))
				.catch((e) => console.log(e))
		}
	})
}
else {
	//electron.ipcRenderer.send('show-app')
}
