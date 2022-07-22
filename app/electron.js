const { app, BrowserWindow } = require('electron');
const path = require('path');
require('electron-reload')(__dirname);

app.whenReady().then(() => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	win.loadFile('index.html');
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
