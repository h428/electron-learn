const { contextBridge, ipcRenderer } = require("electron");

// preload.js 运行于主进程，且具备使用 NodeJS API 的能力，因此可以导入 NodeJS 模块 require("electron") 以使用部分 API，在页面中是不可以的
// 使用 contextBridge 将 versions 对象暴露到渲染进程的 window 对象中
contextBridge.exposeInMainWorld("versions", {
  // 暴露三个箭头函数，用于让 render.js 获取 Node JS 环境的部分变量（也即 NodeJS API），
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // preload.js 运行于渲染进程，因此可以解构出 ipcRenderer，其可用于和主进程通信
  // 封装一个 ping 函数：该函数使用 ipcRenderer 发送一个 ping 消息到主线程
  // 把 ping 函数暴露到 render.js 中，这样页面就可以通过 window.versions.ping 对象间接和主进程通信
  ping: () => ipcRenderer.invoke("ping"),
});
