const { contextBridge, ipcRenderer } = require("electron");

// preload.js 用于将部分 main 线程的 node 操作暴露给 render 线程
// versions 会以 window 下的全局变量存在
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
});
