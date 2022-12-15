const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require("path");
const {autoUpdater} = require("electron-updater");
const log = require("electron-log");
let mainWindow

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


function createWindow () {
  mainWindow = new BrowserWindow({
    minWidth: 850,
    minHeight: 600,
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
    }
  })

  const mainUrl =    url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: 'file:',
    slashes: true
  })

  mainWindow.loadURL(mainUrl);

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
  autoUpdater.checkForUpdatesAndNotify().then(r => {
    sendStatusToWindow("soiya", r)
  } ).catch(err=>{
    sendStatusToWindow("----------------")
    sendStatusToWindow(err)
    sendStatusToWindow("----------------")

  });
}

function sendStatusToWindow(text) {
  log.info(text);
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  sendStatusToWindow('Download progress...');
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})








