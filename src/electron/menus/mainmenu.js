const { Menu } = require('electron')
const path = require('path')
const url = require('url')

const template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Export to file'
			},
			{
				label: 'Import from file'
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