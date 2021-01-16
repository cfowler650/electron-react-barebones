'use strict'

// Import parts of electron to use
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow

// Keep a reference for dev mode
let dev = false

// Determine the mode (dev or production)
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, // width of the window
    height: 768, // height of the window
    show: false, // don't show until window is ready
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  let indexPath

  // Determine the correct index.html file
  // (created by webpack) to load in dev and production
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  // Load the index.html
  mainWindow.loadURL(indexPath)

  // Don't show the app window until it is ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})