const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const handleSetTitle = (event, title) => {
  const webContent = event.sender;
  const win = BrowserWindow.fromWebContents(webContent);
  win.setTitle(title);
};

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("set-title", handleSetTitle);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
