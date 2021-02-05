const vscode = require("vscode");
//SuperAgent是一个轻量级、灵活的、易读的、低学习曲线的客户端请求代理模块，使用在NodeJS环境中。
module.exports = function createFile(createFilePath, config) {
  // let config = require("./config.js");
  let superagent = require("superagent");
  const fs = require("fs");
  let basePath = "";
  const startStr = "/*";
  const endStr = "\n */";
  let resList = [];
  let token = "";
  let sumStr = "";
  const loginUrl = "http://yapi.kapeixi.cn/api/user/login";

  function get(url) {
    return new Promise((resolve, reject) => {
      superagent
        .get(url)
        .set({
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate",
          Host: "yapi.kapeixi.cn",
          //   "Referer": 'http://yapi.kapeixi.cn/login',
          Cookie: token,
        })
        .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res.body.errcode === 0) {
              resolve(res.body);
            } else if (res.body.errcode === 40011) {
            } else {
              vscode.window.showErrorMessage(res.body.errmsg);
            }
          }
        });
    });
  }

  function post() {
    return new Promise((resolve, reject) => {
      superagent
        .post(loginUrl, { email: config.email, password: config.password })
        .set({
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate",
          Host: "yapi.kapeixi.cn",
        })
        .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res.body.errcode === 0) {
              const arr = res.headers["set-cookie"];
              const str1 = arr[0].split(";")[0];
              const str2 = arr[1].split(";")[0];
              token = str1 + "; " + str2;
              resolve(res.body);
            } else {
              vscode.window.showErrorMessage(res.body.errmsg);
            }
          }
        });
    });
  }
  post().then(() => {
    getAllData();
  });

  function getAllData() {
    // 获取basePath
    get(`http://yapi.kapeixi.cn/api/project/get?id=${config.projectId}`).then(
      (res) => {
        if (res.errcode === 0) {
          basePath = res.data.basepath;
        }
      }
    );
    if (config.catId) {
      get(
        `http://yapi.kapeixi.cn/api/interface/list_cat?page=1&limit=20&catid=${config.catId}`
      ).then((res) => {
        if (res.errcode === 0) {
          listHandler(res.data.list);
        }
      });
    } else {
      get(
        `http://yapi.kapeixi.cn/api/interface/list?page=1&limit=20&project_id=${config.projectId}`
      ).then((res) => {
        if (res.errcode === 0) {
          listHandler(res.data.list);
        }
      });
    }
  }

  function listHandler(list) {
    list.forEach((item) => {
      resList.push(getAllInterface(item._id));
    });
    try {
      Promise.all(resList).then((res) => {
        res.forEach((item) => {
          installData(item);
        });
        createJS();
      });
    } catch (err) {
      vscode.window.showErrorMessage(err);
    }
  }

  function getAllInterface(_id) {
    return new Promise((resolve, reject) => {
      get(`http://yapi.kapeixi.cn/api/interface/get?id=${_id}`).then((res) => {
        if (res.errcode === 0) {
          resolve(res.data);
        }
      });
    });
  }

  function installData(itemData) {
    let totalStr =
      startStr +
      " " +
      itemData.title +
      "\n *" +
      " basePath:" +
      basePath +
      itemData.path;
    let headerStr = "\n * Heads:";
    let paramsStr = "\n * Params:\n";
    let responseStr = "\n * Response:";
    if (config.isShowHeader) {
      let header = itemData.req_headers[0];
      if (header) {
        const { name, value } = header;
        headerStr += ` * {name: ${name}, value:${value}}`;
      }
    }
    if (config.isShowParams) {
      // post请求
      if (itemData.req_body_other) {
        const params = JSON.parse(itemData.req_body_other);
        let requiredStr = " *   RequiredParams: [";
        params.required &&
          params.required.forEach((n) => {
            requiredStr += `${n},`;
          });
        paramsStr += requiredStr + "]";
        paramsStr += "\n *   ParamsBody:";
        if (params.properties) {
          paramsStr += handelIterator(params.properties, 0);
        }
      } else if (itemData.req_query) {
        const params = itemData.req_query;

        let requiredStr = " *   RequiredParams: [";
        params.forEach((n) => {
          n.required && (requiredStr += `${n.name},`);
        });
        paramsStr += requiredStr + "]";
        paramsStr += "\n *   ParamsBody:";
        params.forEach((n) => {
          paramsStr += `\n *     ${n.name}:{desc:${n.desc}}`;
        });
      }
    }
    totalStr += headerStr + paramsStr;

    if (config.isShowResponse) {
      if (itemData.res_body) {
        const response = JSON.parse(itemData.res_body);
        if (response.properties) {
          responseStr += handelIterator(response.properties, 0);
        }
      }
    }
    totalStr += responseStr + endStr;
    sumStr += totalStr + "\n\n";
  }
  function handelIterator(originData) {
    let parentStr = "";
    parentStr += iterator(originData, 0);
    return parentStr;
  }
  function iterator(obj, count) {
    let spaceNumStr = " ";
    if (count > 0) {
      let i = 0;
      while (i < count) {
        spaceNumStr += "   ";
        i++;
      }
    }
    let originStr = "";
    if (obj) {
      Object.keys(obj).forEach((key) => {
        let childStr = `\n`;
        childStr += ` *  ${spaceNumStr}  ${key}:{type: ${obj[key].type},description:${obj[key].description}}`;
        if (obj[key].properties) {
          childStr += iterator(obj[key].properties, count + 1);
        }
        if (obj[key].items) {
          if (obj[key].items.items) {
            childStr += iterator(obj[key].items.items.properties, count + 1);
          } else if (obj[key].items.properties) {
            childStr += iterator(obj[key].items.properties, count + 1);
          } else {
            childStr += iterator(obj[key].items, count + 1);
          }
        }
        originStr += childStr;
      });
    }

    return originStr;
  }
  // 写入js
  function createJS() {
    const filePath = `${createFilePath}/${config.jsName}.js`;
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        console.error(err);
      });
      fs.writeFile(filePath, sumStr, (err) => {
        console.error(err);
      });
    } else {
      fs.writeFile(filePath, sumStr, (err) => {
        console.error(err);
      });
    }
  }
};