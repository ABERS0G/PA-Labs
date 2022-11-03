const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')


let win;
function createWindow(){
    win = new BrowserWindow({width: 700, height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }})
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    win.webContents.openDevTools()
    win.on('closed', ()=>{
        win=null
    })
}

app.on('ready', createWindow)