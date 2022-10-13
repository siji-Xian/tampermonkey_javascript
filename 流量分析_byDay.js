// ==UserScript==
// @name         流量分析
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://yuntu.oceanengine.com/yuntu_ng/evaluation_brand/report/flow?*
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      http://cdn.inlymedia.com/JsonExportExcel.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://qmsg.refrain.xyz/message.min.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  var button = document.createElement("button"); //创建一个按钮
  button.textContent = "byDay数据导出"; //按钮内容
  // button.style.width = "120px"; //按钮宽度
  button.style.align = "center"; //文本居中
  button.style.color = "white"; //按钮文字颜色
  button.style.background = "#1f4bd9"; //按钮底色
  button.style.border = "1px solid #1f4bd9"; //边框属性
  button.style.borderRadius = "5px"; //按钮四个角弧度
  // button.style.marginLeft = '10px';
  button.style.fontSize = "12px";
  button.style.padding = "5px";
  button.addEventListener("click", urlClick); //监听按钮点击事件
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const sheetArr = [];

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  //message.js
  let loadingMsg = null;

  //导出（防抖）
  var debounce;

  setTimeout(() => {
    var like_comment = document.getElementsByClassName(
      "byted-tab-bar-items-inner"
    )[0];
    like_comment.append(button); //把按钮加入到 x 的子节点中
  }, 2000);

  function fetchFun(url, data, requestOptions = getRequestOptions) {
    const urlData = Object.keys(data)
      .map((v) => `${v}=${data[v]}`)
      .join("&");
    return fetch(`${url}?${urlData}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        debounce()
        return JSON.parse(result);
      })
      .catch((error) => console.log("error", error));
  }

  //活动总览tabs数据获取
  async function getTabs1Data() {
    var myHeaders = new Headers();
    myHeaders.append("content-type", "application/json;charset=UTF-8");
    let bodyData = {
      task_id: getQueryVariable("task_id"),
      benchmark_type: 2,
      stat_types: [1, 2, 7],
      if_level_3_trigger_point: true,
      trigger_point: {
        level_1_trigger_point: { query_type_point_id: "130000" },
      },
    };
    let postRequestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(bodyData),
      redirect: "follow",
    };
    let data = {
      aadvid: getQueryVariable("aadvid"),
    };
    let title = {
        '触点/日期': 'point_name'
    }
    let contrast = {
    };
    //
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/v2/get_evaluation_flow_by_day_result",
      data,
      postRequestOptions
    );
    console.log(requestData);
    Object.keys(requestData?.data?.item_list[0]?.by_day_list).map(v=>{
        contrast[moment(v).format("YYYY-MM-DD")] = v
    })
    let expData = requestData?.data?.item_list?.map((v,i)=>{
        let data = {}
        Object.keys(v.by_day_list).map(r=>{
            data[r] = v.by_day_list[r]?.pv
        })
        let a = Object.values(v.trigger_point).map(v=>{
            return v.query_type_point_name_zh
        })
        data['point_name'] = a.join('/')
        return {
            data
        }
    })
    // requestData.data.rsp
    let datas = {
      sheetName: "抖音",
      sheetData: expData,
      sheetHeader: Object.keys({...title,...contrast}),
      sheetFilter: Object.values({...title,...contrast}),
      columnWidths: [], // 列宽
    };
    sheetArr.push(datas);
  }

  function expExcel() {
    let option = {};
    option.fileName = "流量分析_byDay"; //文件名
    option.datas = sheetArr;
    console.log(sheetArr);
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function urlClick() {
    getTabs1Data()
    debounce = _.debounce(expExcel, 5000)
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    
  }
})();