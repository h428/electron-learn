// 基于 CommonJS 模块化语法引入两个模块
// app 模块：控制应用的生命周期、事件循环
// BrowserWindow 模块：创建和管理窗口
const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  // 创建一个窗口对象，制定宽高
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // 载入 html 作为窗口内容
  console.log("创建窗口并载入 index.html 作为应用主页");
  win.loadFile("index.html");
};

// 使用 app 模块提供的回调，其中 app.whenReady().then() 在应用准备完毕后调用
app.whenReady().then(() => {
  // 创建并加载窗口;
  createWindow();

  // 在 Mac 中，使用习惯和 Win 不同：所有窗口都关闭，App 并不一定退出，该 App 在任务栏仍然有一个小点，表示应用在运行，但没有任何窗口激活。
  // 此时若单击任务栏上的应用图标，仍然需要重新打开一个窗口，为了应对上述情况，需要监听 activate 事件
  app.on("activate", () => {
    // 没有窗口则创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      console.log("重新激活应用");
      createWindow();
    }
  });
});

// 也可以使用 app.on() 监听时间，而上面的代码本质上是监听 ready 事件 app.on('ready', () => {})，
// 因此下面代码和上面等价，但 app 模块提供了方便接口，对于 ready 事件直接采用上面的代码即可
// app.on("ready", () => {
//   createWindow();
// });

// 在 Windows 中，由于历史习惯，若所有的窗口的关闭，则表示要退出该应用
// 因此需要监听 window-all-closed 事件，该事件在所有窗口都关闭时触发
app.on("window-all-closed", () => {
  // 如果不是 Mac 且所有窗口都关闭，则退出 App
  if (process.platform !== "darwin") {
    console.log("所有窗口关闭，应用退出！");
    app.quit();
  }
});
