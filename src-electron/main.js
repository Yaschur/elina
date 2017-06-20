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
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'clt/index.html'),
		protocol: 'file:',
		slashes: true
	}));

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

ipcMain.on('load-config', (event, content) => {
	let ret = 'no config found';
	if (fs.existsSync(configFilePath)) {
		ret = 'config exists in app dir';
	} else if (fs.exists(oldConfigFilePath)) {
		ret = 'config exist in user data dir';
	} else {
		ret = ret + ': ' + configFilePath + ', ' + oldConfigFilePath;
	}
	event.sender.send('config-loaded', ret);
});
