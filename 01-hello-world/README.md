# 构建 Electron Hello World 程序

参考教程：

- [Prerequisites](https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites)
- [Building your First App](https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app)

## 确定 Node 版本

我们预计选择的 Electron 版本为 [electron@34.5.8](https://releases.electronjs.org/release/v34.5.8)，根据文档描述，其依赖 NodeJS 20.19.1，我们使用 NVM 管理 NodeJS 版本

```bash
nvm install 20.19.1
nvm use 20.19.1
node -v # 20.19.1
```

如果建议采用 pnpm 进行管理，Electron 还涉及到 postinstall 脚本安装问题，后续会详细介绍如何解决。

## 引入 Electron@34.5.8

可以考虑全局安装对应版本的 Electron

```bash
npm i -g electron@34.5.8
```

依次执行下列命令：

```bash
mkdir 01-hello-world && cd 01-hello-world
npm init
npm i electron@34.5.8 -D
```

注意在 package.json 中，把入口文件从 index.js 改为 main.js

最简单的测试，先创建 main.js 文件，并填入一行代码：

```js
console.log("Hello from Electron 👋");
```

然后在 scripts 中添加如下命令后执行 `npm run start` 即可启动应用：

```json
{
  "scripts": {
    "start": "electron ."
  }
}
```

## 解决 pnpm 构建错误问题

Electron 在安装时会执行  `postinstall`  脚本，而 pnpm v10 及以上版本出于安全考虑，默认禁止自动执行依赖包的  `postinstall`  脚本，需手动批准。

若构建失败，可以执行 `pnpm approve-builds`，使用空格勾选 Electron 并继续构建即可。

上述操作实际上是在 packge.json 中配置下述内容，我们手动配置后，删除 node_modules 重新构建，也可达到一样的效果：

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["electron"]
  }
}
```

## 创建 Hello, World 程序

依次创建 index.html, main.js 并填入内容，内容直接参考源文件。

## 使用 VS Code 调试

要使用 VS Code 进行调试要满足两个条件：1）在项目根目录下创建 .vscode/lauch.json 并配置内容；2）必须将项目根目录作为根文件夹在 VS Code 中打开。因此要把 .vscode/lauch.json 创建在 01-hello-world 下并在 VS Code 中打开。

然后，打上断点，在调试面板选择 Main and Render 并以调试模式启动即可。
