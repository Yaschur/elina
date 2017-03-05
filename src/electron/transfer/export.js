const electron = require('electron')
const fs = require('fs')
const path = require('path')
const config = require('../config.json')

const dbName = config.database.nameOrUrl;

const fileName = electron.remote.dialog.showSaveDialog({
	filters: [{ extensions: ['json'] }],
	title: 'Where to export data'
})

if (fileName) {
	const pouchDb = new PouchDB(dbName)
	// let skip = 0
	// let limit = 1000
	pouchDb.allDocs({ include_docs: true })
		.then(res => {
			const content = res.rows
				.filter(item => item.doc.type)
				.map(item => {
					let doc = item.doc
					delete doc._rev
					return doc
				})
			fs.appendFile(fileName, JSON.stringify(content), (err) => {
				if (err) {
					console.log(err)
				}
			})
		}).catch((e) => console.log(e))
}
else {
	electron.ipcRenderer.send('show-app')
}
