# yapiinterfaceexport README

1. 安装插件后，右键会出现‘Yapi Interface Export’命令，点击
2. 点击会在项目根目录中产生 yapiConfig.json 配置文件，并将该文件添加到了.gitignore 文件里，避免提交到仓库
3. 需在配置文件中写入必填字段，
4. 配置完成后，再次点击右键命令，即可在指定位置产生接口文件
   该插件可以导出 Yapi 的接口内容，并在右键触发的位置，产生默认名称为’yapiJs‘的 js 文件

## Features

支持多参数配置，请求头部信息、请求体、返回体是否导出，导出文件名，均可配置

## Requirements

登陆 Yapi 所需的用户邮箱/密码/导出文件名/projectId 均为必填项

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: enable/disable this extension
- `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Working with Markdown

**Note:** You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
- Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
- Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
