const vscode = require("vscode");
const fs = require("fs");
const createYapiFile = require("./createYapiFile.js");
/*
 * 项目分插件本身项目和用户侧项目
 */

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.yapiinterfaceexport",
    function (params) {
      if (params) {
        /*
         * 用户侧路径
         */
        const yapiFilePath = params._fsPath; // 创建yapiJs时，右键点击所在的文件地址
        // const userRootPath = vscode.workspace.workspaceFolders
        //   ? vscode.workspace.workspaceFolders[0].uri.path
        //   : "";
        const userConfigFilePath = yapiFilePath + "/yapiConfig.json";
        if (!fs.existsSync(userConfigFilePath)) {
          vscode.window.showErrorMessage("请确认配置文件存在");
          return;
        }
        /*
         * 插件侧路径
         */
        // const defaultConfig = __dirname + "/yapiDefaultConfig.json";

        /*
         *  如果yapiconfig不存在，则读取插件默认config文件，在用户项目中创建配置文件，并将文件加入 .gitignore,防止文件被提交到仓库
         *  如果yapiconfig存在
         *     读取yapiconfig文件中的配置，判断email，password， projectId三个必填项是否存在
         *        存在：登陆成功并获取接口数据，登陆不成功，将报错抛出；
         *        不存在： 告知用户必填
         */
        // fs.readFile(userRootPath + "/.gitignore", "utf-8", (err, content) => {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     if (!content.includes("yapiConfig.json")) {
        //       fs.writeFile(
        //         userRootPath + "/.gitignore",
        //         content + "\nyapiConfig.json",
        //         (err) => {
        //           if (err) {
        //             console.log(err);
        //           }
        //         }
        //       );
        //     }
        //   }
        // });
        // if (!fs.existsSync(userConfigFilePath)) {
        //   fs.readFile(defaultConfig, "utf-8", function (err, data) {
        //     if (err) {
        //       console.log(err);
        //     } else {
        //       // 加入到.gitignore

        //       fs.writeFile(userConfigFilePath, data, (err) => {
        //         if (err) {
        //           console.log(err);
        //         } else {
        //           vscode.window.showWarningMessage(
        //             "默认配置文件已写入，添加必要配置后，就可以导出文档啦！"
        //           );
        //         }
        //       });
        //     }
        //   });
        // } else {
        fs.readFile(userConfigFilePath, "utf-8", function (err, data) {
          if (err) {
            console.log(err);
          } else {
            const configObj = JSON.parse(data);

            if (
              !configObj.email ||
              !configObj.password ||
              !configObj.projectId
            ) {
              vscode.window.showErrorMessage("配置文件有必传字段未配置");
              // const options = {
              //   prompt:
              //     "请输入Yapi信息，各信息之间用‘;’相隔，如‘1233@qq.com；12345；219；23’ ",
              //   placeHolder:
              //     "请输入Yapi信息，各信息之间用‘;’相隔，如‘1233@qq.com；12345；219；23’",
              // };
              // vscode.window.showInputBox(options).then((value) => {
              //   if (!value) return;
              //   const str = value.replace(/[;；]/g, "%");
              //   const arr = str.split("%");
              //   if (!arr.length || arr.length < 2) {
              //     vscode.window.showErrorMessage("输入内容有误");
              //     return;
              //   }
              //   configObj.email = arr[0];
              //   configObj.password = arr[1];
              //   configObj.projectId = arr[2];
              //   arr.length === 4 && arr[3] ? (configObj.catId = arr[3]) : "";
              //   fs.writeFile(
              //     userConfigFilePath,
              //     JSON.stringify(configObj, null, 4),
              //     (err) => {
              //       if (err) {
              //         console.error(err);
              //       }
              //     }
              //   );
              // });
              return;
            }
            createYapiFile(yapiFilePath, configObj);
          }
        });
        // }
        // const filePath = params._fsPath;
        // const options = {
        //   email: "请输入Yapi用户名: ",
        //   password: "请输入Yapi密码： ",
        //   jsName: "", // 生成的js文件名称
        //   projectId: "请输入projectId", // 子模块id， 如商城模块-用户洞察
        //   catId: "", // 子模块下子分类id，如商城模块-用户洞察-创建页相关接口
        //   isShowHeader: true, // 是否导出header内容
        //   isShowParams: true, // 是否导出传参内容
        //   isShowResponse: true, // 是否导出响应内容
        // };
        // const options1 = {
        //   // 这个对象中所有参数都是可选参数
        //   password: false, // 输入内容是否是密码
        //   ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
        //   placeHolder: "请输入用用户名", // 在输入框内的提示信息
        //   prompt: "赶紧输入，不输入就赶紧滚", // 在输入框下方的提示信息
        // };
        // const options2 = {
        //   // 这个对象中所有参数都是可选参数
        //   password: false, // 输入内容是否是密码
        //   ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
        //   placeHolder: "请输入密码", // 在输入框内的提示信息
        //   prompt: "赶紧输入，不输入就赶紧滚", // 在输入框下方的提示信息
        // };
        // vscode.window.showInputDialog;
        // vscode.window.showInputBox([options1, options2]).then(function (msg) {
        //   console.log("用户输入：" + msg);
        // });
        //   .showSaveDialog({
        //     defaultUri: vscode.Uri.file(__dirname),
        //     saveLabel: "导出Yapi接口文档",
        //     title: "Yapi导出配置",
        //   })
        //   .then((res) => {
        //     console.error(res);
        //   });
        // vscode.window.showInputBox(options).then((value) => {
        //   if (!value) return;

        //   const componentName = value;
        //   const fullPath = `${folderPath}/${componentName}`;

        //   // 生成模板代码，不是本文的重点，先忽略
        //   generateComponent(
        //     componentName,
        //     fullPath,
        //     ComponentType.FUNCTIONAL_COMP
        //   );
        // });
        // if (fs.lstatSync(filePath).isDirectory) {
        //   if (fs.existsSync(filePath + "/template.vue")) {
        //     vscode.window.showWarningMessage("文件已存在");
        //   } else {
        //     fs.readFile(
        //       __dirname + "/src/template.vue",
        //       "utf-8",
        //       function (err, data) {
        //         if (err) {
        //           console.log(err);
        //         } else {
        //           fs.writeFile(filePath + "/template.vue", data, (err) => {
        //             if (err) {
        //             }
        //           });
        //         }
        //       }
        //     );
        //   }
        // }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
