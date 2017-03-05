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

doBackup(doFlag)

function doBackup(doIt) {
	if (!doIt) {
		return;
	}
	const dbName = config.database.nameOrUrl
	const dbBackupName = dbName + '_backup'
	const pouchDb = new PouchDB(dbName)
	let pouchDbBackup = new PouchDB(dbBackupName)

	pouchDbBackup.destroy()
		.then(() => {
			pouchDbBackup = new PouchDB(dbBackupName)
			pouchDb.replicate.to(pouchDbBackup)
				.on('complete', () => electron.ipcRenderer.send('show-app'))
				.on('error', (e) => console.log(e))
		}).catch(e => console.log(e))
}

