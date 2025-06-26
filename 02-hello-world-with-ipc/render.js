const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const func = async () => {
  // 因为 preload.js 中暴露过 versions 对象了，其有一个 ping() 方法，因此可以直接调用
  const response = await window.versions.ping();
  document.getElementById("ping").innerText = response;
};

// 加载页面 3 秒后，再触发调用，这样算是模拟一次自动点击按钮
setTimeout(() => func(), 3000);

// 按钮点击后，调用 ping 发送消息到主进程并追加返回值到段落
document.getElementById("btn").onclick = async () => {
  const response = await window.versions.ping();
  document.getElementById("ping").innerText += response;
};
