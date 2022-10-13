// ==UserScript==
// @name         投后结案
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://yuntu.oceanengine.com/yuntu_ng/evaluation_brand/report/overview?*
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
    var new_element = document.createElement('link');
    new_element.setAttribute('rel', 'stylesheet');
    new_element.setAttribute('href', 'https://qmsg.refrain.xyz/message.min.css');
    document.body.appendChild(new_element);

    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "导出活动总览数据"; //按钮内容
    // button.style.width = "120px"; //按钮宽度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#1f4bd9"; //按钮底色
    button.style.border = "1px solid #1f4bd9"; //边框属性
    button.style.borderRadius = "5px"; //按钮四个角弧度
    // button.style.marginLeft = '10px';
    button.style.fontSize = '12px';
    button.style.padding = '5px';
    button.addEventListener("click", urlClick); //监听按钮点击事件
    const getRequestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const sheetArr = []

    function getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    //message.js
    let loadingMsg = null

    //导出（防抖）
    var debounce
    
    setTimeout(() => {
        var like_comment = document.getElementsByClassName('byted-tab-bar-items-inner')[0];
        like_comment.append(button); //把按钮加入到 x 的子节点中
    }, 2000);

    function fetchFun(url,data, requestOptions=getRequestOptions){
        const urlData = Object.keys(data).map(v => `${v}=${data[v]}`).join('&')
        return fetch(`${url}?${urlData}`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    debounce()
                    return JSON.parse(result)
                })
                .catch(error => console.log('error', error));
    }

    //活动总览tabs数据获取
    async function getTabs1Data(e) {
        let sheetName = e == 2 ? '行业TOP5%品牌均值' : e == 3 ? '行业TOP10%品牌均值' : e == 4 ? '行业TOP25%品牌均值' : '对比品牌均值'
        let formdata = new FormData();
        let postRequestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        let data = {
            aadvid:getQueryVariable('aadvid'),
        }
        formdata.append("benchmark_type", e);
        formdata.append("task_id", getQueryVariable('task_id'));
        let contrast = {
            曝光次数:'pv',
            行业曝光次数:'pv_benchmark',
            曝光人数:'uv',
            行业曝光人数:'uv_benchmark',
            CTR:'ctr',
            行业CTR:'ctr_benchmark',
            互动率:'engagement_rate',
            行业互动率:'engagement_rate_benchmark',
            消耗金额:'cost',
            行业消耗金额:'cost_benchmark',
            CPM:'cpm',
            行业CPM:'cpm_benchmark',
            CPC:'cpc',
            行业CPC:'cpc_benchmark',
            CPE:'cpe',
            行业CPE:'cpe_benchmark',
            拉新人群规模:'a0_to_a1_4_uv',
            本品拉新比例:'a0_to_a1_4_uv_rate',
            行业拉新比例:'a0_to_a1_4_uv_rate_benchmark',
            转粉人群规模:'post_a5_uv',
            本品粉丝增长率:'post_a5_uv_rate',
            行业粉丝增长率:'post_a5_uv_rate_benchmark',
            关系加深人群规模:'pos_flow_uv',
            本品关系加深率:'pos_flow_uv_rate',
            行业关系加深率:'pos_flow_uv_rate_benchmark',
            投后日均搜索人数:'search_after_show_uv',
            投前7天搜索人数:'search_before_show_uv',
            本期投放NPS:'advertising_nps',
            本品整体NPS:'brand_nps',
            转化金额:'convert_amount',
            转化人数:'convert_uv',
            新客占比:'new_convert_rate',
            转化率:'ctr_pv',
            ROI:'roi',
            客单价:'transaction_per_customer',
            获客成本:'cac'
            
        }
        //品牌触达表现
        let requestData = await fetchFun(
            'https://yuntu.oceanengine.com/measurement/api/v2/get_evaluation_homepage_flow_overview',
            data,
            postRequestOptions
        )
        //品牌心智表现
        let requestData2 = await fetchFun(
            'https://yuntu.oceanengine.com/measurement/api/v2/get_evaluation_homepage_mind_overview',
            data,
            postRequestOptions
        )
        //品牌转化表现
        let requestData3 = await fetchFun(
            'https://yuntu.oceanengine.com/measurement/api/v2/get_evaluation_convert_analysis_total',
            {
                aadvid:getQueryVariable('aadvid'),
                task_id:getQueryVariable('task_id')
            }
        )

        // requestData.data.rsp
        let datas = {
            sheetName,
            sheetData:[{...requestData.data.rsp,...requestData2.data,...requestData3.data.total_metrics}],
            sheetHeader:Object.keys(contrast),
            sheetFilter:Object.values(contrast),
            columnWidths: [], // 列宽
        }
        sheetArr.push(datas)
    }



    function expExcel() {
        let option={};
        option.fileName = '结案数据' //文件名
        option.datas=sheetArr;
        console.log(sheetArr)
        var toExcel=new ExportJsonExcel(option);
        toExcel.saveExcel();
        loadingMsg.close()
    }

    function urlClick() {
        let benchmark_type = [2,3,4,5]
        benchmark_type.forEach(e=>{
            getTabs1Data(e)
        })
        debounce = _.debounce(expExcel, 5000)
        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
        // setTimeout(()=>{
        //     expExcel()
        // },5000)
    }
})();
