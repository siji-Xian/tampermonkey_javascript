// ==UserScript==
// @name         星图筛选条件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.xingtu.cn/ad/creator/market
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      http://cdn.inlymedia.com/JsonExportExcel.min.js
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      https://qmsg.refrain.xyz/message.min.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  //message.js
  let loadingMsg = null;
  let loadingMsg1 = null;

  var button = document.createElement("button"); //创建一个按钮
  button.textContent = "导出筛选条件"; //按钮内容
  button.style.height = "38px"; //高
  button.style.lineHeight = "38px"; //行高
  button.style.align = "center"; //文本居中
  button.style.color = "#FFF"; //按钮文字颜色
  button.style.background = "rgb(234,94,32)"; //按钮底色
//   button.style.background = "url(\"https://siji-xian.github.io/inly_icon.ico\") no-repeat -5px -43px;"; //按钮底色
//   button.style.backgroundSize = "98px"
  button.style.border = "0px solid #eee"; //边框属性
  button.style.borderRadius = "20px"; //按钮四个角弧度
  button.style.marginLeft = "10px";
  button.style.fontSize = "14px";
  button.style.padding = "0 15px";
  button.addEventListener("click", urlClick); //监听按钮点击事件

  var text = document.createElement("div"); //创建一段文字
  text.textContent = "注：请在达人列表加载完成后再点击导出"
  text.style.height = '38px'
  text.style.display = 'flex'
  text.style.alignItems = 'flex-end'
  text.style.fontSize = '12px'
  text.style.color = 'red'

  var a = document.createElement("a");
  a.textContent = "点击跳转取数工具"
  a.href = 'https://www.baidu.com'
  a.target = '_blank'
  a.style.height = '38px'
  a.style.display = 'flex'
  a.style.alignItems = 'flex-end'
  a.style.fontSize = '12px'
  a.style.marginLeft = '5px'


  setTimeout(() => {
    var like_comment = document.getElementsByClassName("search-container")[0];
    like_comment.append(button); //把按钮加入到 x 的子节点中
    like_comment.append(text); //把按钮加入到 x 的子节点中
    like_comment.append(a); //把按钮加入到 x 的子节点中
  }, 2000);

  let apiLists = [];
  let targetUrl = "/h/api/gateway/handler_get/";
  ah.proxy({
    //请求发起前进入
    onRequest: (config, handler) => {
      // console.log(config.url)
      apiLists.push(config.url);
      handler.next(config);
    },
    //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError: (err, handler) => {
      // console.log(err.type)
      handler.next(err);
    },
    //请求成功后进入
    onResponse: (response, handler) => {
      // console.log(response.response)
      handler.next(response);
    },
  });

  //query参数获取
  function getQueryVariable(url, variable) {
    var query = url.slice(28);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      console.log(pair);
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }
  //默认GET请求
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //网络请求
  function fetchFun(url, data = {}, requestOptions = getRequestOptions) {
    const urlData = Object.keys(data)
      .map((v) => `${v}=${data[v]}`)
      .join("&");
    return fetch(`${url}?${urlData}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        return JSON.parse(result);
      })
      .catch((error) => console.log("error", error));
  }

  //获取筛选参数
  async function getQueryString() {
    let newList = apiLists.map((v) => {
      return { target: v.substring(0, 27), lang: v };
    });
    let targetUrlLists = newList.filter((v) => {
      return v.target === targetUrl;
    });
    let targetUrlString = targetUrlLists[targetUrlLists.length - 2]?.lang;
    let platform_source = getQueryVariable(targetUrlString, "platform_source");
    let order_by = decodeURI(getQueryVariable(targetUrlString, "order_by"));
    let sort_type = decodeURI(getQueryVariable(targetUrlString, "sort_type"));
    let search_scene = decodeURI(
      getQueryVariable(targetUrlString, "search_scene")
    );
    let display_scene = decodeURI(
      getQueryVariable(targetUrlString, "display_scene")
    );
    let limit = decodeURI(getQueryVariable(targetUrlString, "limit"));
    let page = decodeURI(getQueryVariable(targetUrlString, "page"));
    let regular_filter = decodeURI(
      getQueryVariable(targetUrlString, "regular_filter")
    );
    let attribute_filter = decodeURI(
      getQueryVariable(targetUrlString, "attribute_filter")
    );
    let author_pack_filter = decodeURI(
      getQueryVariable(targetUrlString, "author_pack_filter")
    );
    let author_list_filter = decodeURI(
      getQueryVariable(targetUrlString, "author_list_filter")
    );
    let service_name = decodeURI(
      getQueryVariable(targetUrlString, "service_name")
    );
    let service_method = decodeURI(
      getQueryVariable(targetUrlString, "service_method")
    );
    let sign_strict = decodeURI(
      getQueryVariable(targetUrlString, "sign_strict")
    );
    let sign = decodeURI(getQueryVariable(targetUrlString, "sign"));
    if (!platform_source) return false;
    let data = {
        platform_source,
        order_by:`"${order_by}"`,
        sort_type,
        search_scene,
        display_scene,
        limit,
        page,
        regular_filter,
        attribute_filter,
        author_pack_filter,
        author_list_filter,
        service_name:`"${service_name}"`,
        service_method:`"${service_method}"`,
        sign_strict,
        // sign,
      }
    return data;
  }

  //获取达人列表
  async function getHotUserList(e) {
    let baseUrl = "https://www.xingtu.cn/h/api/gateway/handler_get/";
    let data = e;
    let requestData = await fetchFun(baseUrl, data);
    console.log(requestData);
  }

  //导出exl
  function expExcel(e, data) {
    console.log(data, "DATA");
    let option = {};
    option.fileName = e; //文件名
    option.datas = [
      {
        sheetName: `sheet1`,
        sheetData: [data],
        sheetHeader: [
            'platform_source',
            'order_by',
            'sort_type',
            'search_scene',
            'display_scene',
            'limit',
            'page',
            'regular_filter',
            'attribute_filter',
            'author_pack_filter',
            'author_list_filter',
            'service_name',
            'service_method',
            'sign_strict'
        ],
        sheetFilter: [
            'platform_source',
            'order_by',
            'sort_type',
            'search_scene',
            'display_scene',
            'limit',
            'page',
            'regular_filter',
            'attribute_filter',
            'author_pack_filter',
            'author_list_filter',
            'service_name',
            'service_method',
            'sign_strict'
        ],
        columnWidths: [], // 列宽
      },
      {
        sheetName: `sheet2`,
        sheetData: [{user:'001'}],
        sheetHeader: [
            'user'
        ],
        sheetFilter: [
            'user'
        ],
        columnWidths: [], // 列宽
      },
    ];
    console.log(option);
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    // loadingMsg1.close()
  }

  async function urlClick() {
    let res = await getQueryString();
    if (!res) {
      loadingMsg = Qmsg.error("未选择任何条件！");
      return;
    }
    loadingMsg1 = Qmsg.info("正在导出，请勿重复点击！")
    // console.log(res);
    expExcel(`星图达人筛选条件_${moment().format("YYYYMMDDHHmmss")}`, res);
  }
})();
