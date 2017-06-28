const electron = require('electron');
const { app, BrowserWindow, globalShortcut, ipcMain } = electron;
const path = require('path');
const url = require('url');
const fs = require('fs');
const configFileName = 'config.json';
const configFilePath = path.join(
	app.getPath('userData'),
	configFileName
);
const oldConfigFilePath = path.join(__dirname, configFileName);
// const dbBackupPath = path.join(__dirname, 'dbBackups');

// if (!fs.existsSync(dbBackupPath)) {
// 	fs.mkdirSync(dbBackupPath);
// }

let mainWindow = null;

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
	// Someone tried to run a second instance, we should focus our window.
	if (mainWindow) {
		if (mainWindow.isMinimized())
			mainWindow.restore();
		mainWindow.focus();
	}
})

if (shouldQuit) {
	app.quit();
}

function createWindow() {
	const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
	// Create the browser window.
	mainWindow = new BrowserWindow({ width: width, height: height });
	mainWindow.setMenu(null);

	// and load the index.html of the app.
	loadWindow();

	// Open the DevTools.
	globalShortcut.register('Ctrl+Shift+D', () => mainWindow.toggleDevTools());

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

function loadWindow() {
	if (mainWindow) {
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'clt/index.html'),
			protocol: 'file:',
			slashes: true
		}));
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('load-config', event => {
	let ret = '';
	if (fs.existsSync(configFilePath)) {
		ret = fs.readFileSync(configFilePath, 'utf8');
	} else if (fs.existsSync(oldConfigFilePath)) {
		ret = fs.readFileSync(oldConfigFilePath, 'utf8');
		fs.writeFileSync(configFilePath, ret);
	}
	event.sender.send('config-loaded', ret);
});

ipcMain.on('save-file', (event, content) => {
	let ret = '';
	const fileName = electron.dialog.showSaveDialog({
		filters: [{ name: 'data', extensions: ['json'] }],
		title: 'Where to export data'
	});
	if (fileName) {
		fs.writeFile(fileName, content, (err) => event.sender.send('file-saved', ret));
	}
	else {
		event.sender.send('file-saved', 'cancelled by user');
	}
});

ipcMain.on('load-file', event => {
	const fileName = electron.dialog.showOpenDialog({
		filters: [{ name: 'data', extensions: ['json'] }],
		title: 'Choose file to import'
	});
	if (fileName) {
		fs.readFile(fileName[0], (err, data) => {
			if (err) {
				event.sender.send('file-loaded', '');
			}
			else {
				event.sender.send('file-loaded', data);
			}
		})
	}
	else {
		event.sender.send('file-loaded', '');
	}
});

ipcMain.on('reload-app', () => loadWindow());
