// ==UserScript==
// @name         星图筛选工具（开发版）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  星图扩展工具
// @author       siji-Xian
// @match        *://www.xingtu.cn/ad/creator/market
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  // 弹窗组件

  // function inlyModelComponent(){
  //   this.
  // }


  const closeModel = ()=>{
    $("#inly_model").css({opacity:0})
    setTimeout(() => {
      document.getElementById('inly_model').style.display = 'none'
    }, 500);
  }

  var htmlModel = `
  <div style="transition: opacity .5s; opacity: 0; position:absolute;top: 0;left: 0;width: 100vw;height: 100vh;background-color:rgba(0,0,0,0.2);z-index: 888;display: 
  none;" id="inly_model">
    <div id="inly_box" style="position:absolute;top:50%;left: 50%;transform: translate(-50%, -100%);height: 200px;width: 350px;background-color: #fff;border-radius: 10px;display: flex;justify-content: center;align-items: center;">
      <div style="position: absolute;left: 10px;top: 10px;font-size: 14px;">登录-核力小黑盒</div>
      <div style="position: absolute;top: 0px;right: 10px; z-index: -1; opacity: 0.5;width: 160px;">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="160px" height="160px" viewBox="0 0 128 128" enable-background="new 0 0 128 128" xml:space="preserve">  
          <image id="image0" width="128" height="128" x="0" y="0"
              href="data:image/png;base64,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
          AAAASUVORK5CYII=" />
          </svg>
      
      </div>
      <form action="" method="post" id="form1" >
        <p style="margin-bottom: 10px;font-size: 14px;">账号: <input type="text" name="fname" style="background-color: rgba(255,255,255,0.2);border:0px;border-bottom: 1px solid #999;"/></p>
        <p style="margin-bottom: 10px;font-size: 14px;">密码: <input type="password" name="lname" style="background-color: rgba(255,255,255,0.2);border:0px;border-bottom: 1px solid #999;"/></p>
        <button id='inly_submit' style="border: 0px; background-color:rgb(234, 94, 32) ;color: #fff;height: 28px;width: 50px; border-radius: 5px;">登录</button>
      </form>
    </div>
  </div>
  `

  $("body").append(htmlModel);

 

  $("#inly_model").click(function(event){
    console.log("second");
    closeModel()
    stopPropagation()
    return false;
  });

  $("#inly_box").click(function(event){
    stopPropagation()
    return false;
  });

  $("#inly_submit").click(function(e){ 
    console.log(e)
    var name_1=$("input[name='fname']").val();   //获取
    var name_2=$("input[name='lname']").val();   //获取
    console.log(name_1,name_2)
    stopPropagation()
    return false;  //返回false 停止提交
  }) 

  const showModel = () =>{
    $("#inly_model").css({display:'block'})
    setTimeout(() => {
      $("#inly_model").css({opacity:1})
    }, 0);
  }

  function stopPropagation(e){
    e = e|| window.event;
    if (e.stopPropagation) {
      e.stopPropagation()
    } else {
      e.cancelBubble = true
      
    }
  };
  


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
  a.href = 'http://192.168.12.119:8080'
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
  // //默认GET请求
  // const getRequestOptions = {
  //   method: "GET",
  //   redirect: "follow",
  // };

  // //网络请求
  // function fetchFun(url, data = {}, requestOptions = getRequestOptions) {
  //   const urlData = Object.keys(data)
  //     .map((v) => `${v}=${data[v]}`)
  //     .join("&");
  //   return fetch(`${url}?${urlData}`, requestOptions)
  //     .then((response) => response.text())
  //     .then((result) => {
  //       return JSON.parse(result);
  //     })
  //     .catch((error) => console.log("error", error));
  // }

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

  //获取已选参数明文
  async function getQueryText(){
    let queryText = document.getElementsByClassName('selected-list')[0]
    let a = queryText.getElementsByClassName("tag-label")
    let arr = Array.from(a)
    let data = arr.map(v => {
      let shareArr = v.innerHTML
      return {'shaer':shareArr}
    });
    return data
  }

  //导出exl
  function expExcel(e, data, shaer) {
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
        sheetData: shaer,
        sheetHeader: [
            'shaer'
        ],
        sheetFilter: [
            'shaer'
        ],
        columnWidths: [], // 列宽
      },
      {
        sheetName: `sheet3`,
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
    showModel()

    return
    GM_xmlhttpRequest({  
      url:"http://192.168.12.119:8081/xingtu_app/select/",  
      method:'Get',  
      headers: {  
      "content-type": "application/json"  
      },  
      data:"page=1&num=10&status=2",  
      onerror:function(res){  
          console.log(res);  
      },  
      onload:function(res){  
          console.log(JSON.parse(res.responseText));  
      }  
    }); 
    return
    let res = await getQueryString();
    if (!res) {
      loadingMsg = Qmsg.error("未选择任何条件！");
      return;
    }
    let shaerText = await getQueryText()
    loadingMsg1 = Qmsg.info("正在导出，请勿重复点击！")
    // console.log(res);
    expExcel(`星图达人筛选条件_${moment().format("YYYYMMDDHHmmss")}`, res, shaerText);
  }
})();
