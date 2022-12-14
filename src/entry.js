const {app, BrowserWindow} = require('electron')
const url = require('url')
let mainWindow

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
    pathname: 'localhost:4200',
    protocol: 'http:',
    slashes: true
  })

  mainWindow.loadURL(mainUrl);

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})








