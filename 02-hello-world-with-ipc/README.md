# 使用预加载脚本 preload.js

[Using Preload Scripts](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload)

## 快速了解进程模型

Electron 采用主进程（Main Process）​​ 与渲染进程（Renderer Process）​​ 分离的设计，结合预加载脚本（Preload Script）​​ 实现安全通信。

主进程：作为应用的唯一入口（通常为 main.js），运行在 ​​Node.js 环境中，拥有完整的系统权限（如访问文件系统、调用原生 API），但无法操作 DOM。主进程一般有如下职责：

- 创建和管理应用窗口（BrowserWindow）
- 控制应用生命周期（启动、退出、激活等事件）
- 处理系统级操作（菜单、托盘、全局快捷键）

渲染进程：每个窗口对应一个独立的渲染进程，运行在 ​​Chromium 浏览器环境中，默认无 Node.js 权限 ​（需通过预加载脚本安全暴露）。渲染进程一般有如下职责：

- 渲染用户界面（HTML/CSS/JavaScript）。
- 处理用户交互（点击、输入等）。
- 通过预加载脚本与主进程通信（IPC）

预加载脚本（Preload Script）​​ 运行于渲染进程的上下文，在渲染进程加载网页前执行，作为安全桥梁 ​​，通过 contextBridge 向渲染进程暴露有限的 Node.js 或 Electron API。其大致有如下特性：

- 上下文隔离（Context Isolation）​​：默认启用，防止网页脚本直接访问 Node.js 全局对象（如 process）。
- 选择性暴露 ​：仅通过 exposeInMainWorld 显式暴露必要的 API

## 对 preload.js 的说明

### 使用 contextBridge 暴露部分 NodeJS API

根据进程模型，我们知道 index.html 引入的 render.js 运行于渲染进程，出于安全考虑其无法访问 NodeJS API，因此需要有 preload.js 作为中间桥梁使用 NodeJS API。

预加载虽然也运行于渲染进程，但该脚本在渲染进程载入网页前执行，故可以访问 Node.js 和 Electron API，因此可以直接使用 process 这类变量(NodeJS 环境的一部分)。

在 preload.js 中可以使用 contextBridge 将一部分 NodeJS API 暴露给渲染线程，比如 contextBridge.exposeInMainWorld 用于将指定的属性或方法注入到渲染进程的 window 对象中，当然要让这个预加载生效，要在创建窗口时指定对应的预加载脚本文件，这样 Electron 才知道，指定代码在 main.js 中的创建窗口处的 webPreferences 属性。

### 使用 ipcRenderer 进行进程间通信

预加载脚本运行于渲染进程，因此 electron 模块可以直接解构出来 ipcRenderer，而 ipcMain 则为 undefined，而 main.js 则与之相反。

```js
// preload.js: ipcRenderer 可用，ipcMain 为 undefined
const { contextBridge, ipcRenderer, ipcMain } = require("electron");
```

## 小结

index.html 窗口和其脚本 render.js 运行于渲染进程，出于安全考虑，不能让页面直接访问 NodeJS API，但又必须有这样的需求，因此引入 preload.js，它也运行于渲染进程，但可以访问 NodeJS API 并把 API 通过添加到 window 对象的形式，让 render.js 可以间接访问一部分 NodeJS API。

此外渲染进程还可能需要修改或者获取主进程的一些东西，这种时候就要通过进程间通信来完成，通过 ipcRenderer 和 ipcMain 这两个对象完成两个进程间的通信。

同样，把上述两点结合起来，通过把进程间通信封装成 API 并暴露给页面的 window 对象，达到在页面操作影响主进程的目的。

比如单击页面按钮删除文件：

- 删除文件的 API 应该在主进程中，只有主进程才有权限操作
- 页面按钮的毁掉应该在 render.js 中，但 render.js 不能使用 NodeJS 模块因此不能直接和主进程通信，要借助 preload.js
- preload.js 也运行在渲染进程，但有访问 NodeJS API 的能力，因此可以和主进程通信，可以把这个通信封装成函数，并通过 contextBridge 把函数暴露给 render.js，而这个暴露是通过在 window 对象添加对应属性来实现的，因此在 render.js 可以通过 window.xxx 读取到封装的函数，从而达到间接调用 NodeJS API 的效果。
