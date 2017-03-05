const electron = require('electron')
const config = require('../config.json')

let doFlag = true
if (!config.database) {
	console.log("No database is configured")
	//electron.ipcRenderer.send('show-app')
	doFlag = false
}

if (!config.database.backupAllowed) {
	console.log("Backup is not allowed by config")
	//electron.ipcRenderer.send('show-app')
	doFlag = false
}

doRestore(doFlag)

function doRestore(doIt) {
	if (!doIt) {
		return;
	}
	const dbName = config.database.nameOrUrl
	const dbBackupName = dbName + '_backup'
	let pouchDb = new PouchDB(dbName)
	const pouchDbBackup = new PouchDB(dbBackupName)

	pouchDb.destroy()
		.then(() => {
			pouchDb = new PouchDB(dbName)
			pouchDbBackup.replicate.to(pouchDb)
				.on('complete', () => electron.ipcRenderer.send('show-app'))
				.on('error', (e) => console.log(e))
		}).catch(e => console.log(e))
}

