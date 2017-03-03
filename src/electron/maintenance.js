const electron = require('electron')
//electron.remote.dialog.showMessageBox({ message: "It's seems working" })
electron.remote.dialog.showSaveDialog({ title: 'Transfer database to file', filters: [{ name: 'database', extensions: ['json'] }] }, (file) => {
	electron.remote.dialog.showMessageBox({ message: file })
	electron.ipcRenderer.send('show-app')
})
