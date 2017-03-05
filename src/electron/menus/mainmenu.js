const { Menu } = require('electron')
const path = require('path')
const url = require('url')

const template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Reload',
				click() {
					require('electron').ipcMain.emit('show-app')
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Export to file',
				click(item, win) {
					win.loadURL(url.format({
						pathname: path.join(__dirname, '../transfer/export.html'),
						protocol: 'file:',
						slashes: true
					}))
				}
			},
			{
				label: 'Import from file',
				click(item, win) {
					win.loadURL(url.format({
						pathname: path.join(__dirname, '../transfer/import.html'),
						protocol: 'file:',
						slashes: true
					}))
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Exit',
				role: 'close'
			}
		]
	},
	{
		label: 'Database',
		submenu: [
			{
				label: 'Backup database',
				click(item, win) {
					win.loadURL(url.format({
						pathname: path.join(__dirname, '../maintenance/backup.html'),
						protocol: 'file:',
						slashes: true
					}))
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Restore database',
				click(item, win) {
					win.loadURL(url.format({
						pathname: path.join(__dirname, '../maintenance/restore.html'),
						protocol: 'file:',
						slashes: true
					}))
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Clear database',
				click(item, win) {
					win.loadURL(url.format({
						pathname: path.join(__dirname, '../maintenance/clear.html'),
						protocol: 'file:',
						slashes: true
					}))
				}
			}
		]
	}
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)