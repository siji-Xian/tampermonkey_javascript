// ==UserScript==
// @name         GTA导出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://yuntu.oceanengine.com/yuntu_ng/assets/crowd/monitoring?*
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://cuikangjie.github.io/JsonExportExcel/dist/JsonExportExcel.min.js
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
    button.textContent = "导出进行中活动数据"; //按钮内容
    button.style.height = "32px"; //高
    button.style.lineHeight = "32px"; //行高
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#1f4bd9"; //按钮底色
    button.style.border = "0px"; //边框属性
    button.style.borderRadius = "0px"; //按钮四个角弧度
    button.style.marginLeft = '10px';
    button.style.fontSize = '12px';
    button.style.padding = '0 5px';
    button.addEventListener("click", urlClick); //监听按钮点击事件

    var button2 = document.createElement("button"); //创建一个按钮
    button2.textContent = "导出历史活动数据"; //按钮内容
    button2.style.height = "32px"; //高
    button2.style.lineHeight = "32px"; //行高
    button2.style.align = "center"; //文本居中
    button2.style.color = "white"; //按钮文字颜色
    button2.style.background = "#1f4bd9"; //按钮底色
    button2.style.border = "0px"; //边框属性
    button2.style.borderRadius = "0px"; //按钮四个角弧度
    button2.style.marginLeft = '10px';
    button2.style.fontSize = '12px';
    button2.style.padding = '0 5px';
    button2.addEventListener("click", urlClick2); //监听按钮点击事件

    var button3 = document.createElement("button"); //创建一个按钮
    button3.textContent = "导出自定义查询数据"; //按钮内容
    button3.style.height = "32px"; //高
    button3.style.lineHeight = "32px"; //行高
    button3.style.align = "center"; //文本居中
    button3.style.color = "white"; //按钮文字颜色
    button3.style.background = "#1f4bd9"; //按钮底色
    button3.style.border = "0px"; //边框属性
    button3.style.borderRadius = "0px"; //按钮四个角弧度
    button3.style.marginLeft = '10px';
    button3.style.fontSize = '12px';
    button3.style.padding = '0 5px';
    button3.addEventListener("click", urlClick3); //监听按钮点击事件
    
    //message.js
    let loadingMsg = null

    //导出文件名
    let fileName = ''
    
    //默认GET请求
    const getRequestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    setTimeout(() => {
        var like_comment = document.getElementsByClassName('index__left--1Ld3H')[0];
        like_comment.append(button); //把按钮加入到 x 的子节点中
        like_comment.append(button2); //把按钮加入到 x 的子节点中
        like_comment.append(button3); //把按钮加入到 x 的子节点中
    }, 2000);

    //导出（防抖）
    var debounce

    //导出数据
    const sheetArr = []

    //query参数获取
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
    //获取brand信息
    let brand = localStorage.getItem('__Garfish__platform__yuntu_user') || ''
    let brands = JSON.parse(brand)

    //封装网络请求(带导出)
    function fetchFun(url,data={}, requestOptions=getRequestOptions){
        const urlData = Object.keys(data).map(v => `${v}=${data[v]}`).join('&')
        return fetch(`${url}?${urlData}`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    debounce()
                    return JSON.parse(result)
                })
                .catch(error => console.log('error', error));
    }
    function fetchFun2(url,data={}, requestOptions=getRequestOptions){
        const urlData = Object.keys(data).map(v => `${v}=${data[v]}`).join('&')
        return fetch(`${url}?${urlData}`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    return JSON.parse(result)
                })
                .catch(error => console.log('error', error));
    }
    //获取行业id
    async function getIndustryId(){
        let industry_id_url = `https://yuntu.oceanengine.com/yuntu_ng/api/v1/get_user_info`
        let res = await fetchFun2(industry_id_url,{aadvid:getQueryVariable('aadvid')})
        let industryValue = document.getElementsByClassName('byted-input-size-md')[0].value.split('/')[document.getElementsByClassName('byted-input-size-md')[0].value.split('/').length - 1]
        let data = res
        let a = data?.data?.brandMetadata?.filter((e)=>{
            return e?.industry_name == industryValue
        })[0]
        return a.industry_id
    }

    //活动类型记录获取
    async function getQueryType(e){
        let industry_id = await getIndustryId()
       
        let data = {
            aadvid:getQueryVariable('aadvid'),
            report_name:'',
            page_index:1,
            page_size:1,
            query_type:e, //1:进行中活动，2:历史活动 3:自定义
            brand_id:brands.brand_id,
            report_status:0,
            industry_id
        }
        let requestData1 = await fetchFun2(
            'https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaReportQueryList',
            data
        )
        data.page_size = requestData1.data.total
        let requestData = await fetchFun2(
            'https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaReportQueryList',
            data
        )
        requestData.data.reports.forEach(v => {
            getTabsData(v.report_id,v.report_name)
            getTermTabsItem(v.report_id,v.report_name)
        });
        // console.log(requestData)
    }

    //活动数据获取
    async function getTabsData(report_id,report_name) {
        let contrast = {
            新客人数:'old_gmv_deal_cnt',
            新客GMV:'old_gmv_gmv',
            新客客单价:'old_gmv_unit_price',
            老客人数:'old_deal_cnt',
            老客GMV:'old_gmv',
            老客客单价:'old_unit_price',
            活动期成交人数:"cover_num",
            活动期gmv:'gmv',
            活动期客单价:'unit_price',
            gmv目标完成度:'gmv_process',
            最新日期:'latest_date',
            新增A1规模:'new_A1_cover_num',
            新增A1贡献新客人数:'new_A1_deal_cnt',
            新增A1贡献占比:'new_A1_deal_rate',
            新增A1转化率:'new_A1_flow_rate',
            新增A2规模:'new_A2_cover_num',
            新增A2贡献新客人数:'new_A2_deal_cnt',
            新增A2贡献占比:'new_A2_deal_rate',
            新增A2转化率:'new_A2_flow_rate',
            新增A3规模:'new_A3_cover_num',
            新增A3贡献新客人数:'new_A3_deal_cnt',
            新增A3贡献占比:'new_A3_deal_rate',
            新增A3转化率:'new_A3_flow_rate',
            存量A1规模:'old_A1_cover_num',
            存量A1贡献新客人数:'old_A1_deal_cnt',
            存量A1贡献占比:'old_A1_deal_rate',
            存量A1转化率:'old_A1_flow_rate',
            存量A2规模:'old_A2_cover_num',
            存量A2贡献新客人数:'old_A2_deal_cnt',
            存量A2贡献占比:'old_A2_deal_rate',
            存量A2转化率:'old_A2_flow_rate',
            存量A3规模:'old_A3_cover_num',
            存量A3贡献新客人数:'old_A3_deal_cnt',
            存量A3贡献占比:'old_A3_deal_rate',
            存量A3转化率:'old_A3_flow_rate',
            o人群贡献占比:'o_rate'
        }

        let data = {
            aadvid:getQueryVariable('aadvid'),
            brand_id:brands.brand_id,
            report_id,
        }
        let requestData = await fetchFun(
            'https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaHarvestGmvProfile',
            data
        )
        let res = requestData.data.profile
        let new_gmv = {}
        Object.keys(res.new_gmv).forEach(v => {
            new_gmv[`old_gmv_${v}`] = res.new_gmv[v]
        });
        let new_gmv_new_analysis = {}
        res.new_gmv.new_analysis.map((v,i)=>{
            let name = i == 0 ? 'old' : i == 1 ? 'new' : 'o' 
            Object.keys(v).forEach(res => {
                new_gmv_new_analysis[`${name}_${res}`] = v[res]
            });
        })

        let new_gmv_new_analysis_details = {}
        new_gmv_new_analysis.new_details.map((v,i)=>{
            let name = i == 0 ? 'new_A1' : i == 1 ? 'new_A2' : 'new_A3' 
            Object.keys(v).forEach(res => {
                new_gmv_new_analysis_details[`${name}_${res}`] = v[res]
            });
        })
        new_gmv_new_analysis.old_details.map((v,i)=>{
            let name = i == 0 ? 'old_A1' : i == 1 ? 'old_A2' : 'old_A3' 
            Object.keys(v).forEach(res => {
                new_gmv_new_analysis_details[`${name}_${res}`] = v[res]
            });
        })
        
        let old_gmv = {}
        Object.keys(res.old_gmv).forEach(v => {
            old_gmv[`old_${v}`] = res.old_gmv[v]
        });
        let sheetData = [{...res,...new_gmv,...old_gmv,...new_gmv_new_analysis,...new_gmv_new_analysis_details}]
        // console.log(sheetData)
        let datas = {
            sheetName:report_name,
            sheetData,
            sheetHeader:Object.keys(contrast),
            sheetFilter:Object.values(contrast),
            columnWidths: [], // 列宽
        }
        sheetArr.push(datas)
    }

    //活动期转化Item获取
    async function getTermTabsItem(report_id,report_name) {
        let industry_id = await getIndustryId()
        let data = {
            aadvid:getQueryVariable('aadvid'),
            industry_id,
            brand_id:brands.brand_id,
            report_id,
            gta_type:1
        }
        let requestData = await fetchFun2(
            'https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaHarvestAnalysisProfile',
            data
        )
        let res = requestData.data.profiles

        let expExcel2Data = await Promise.all(
            res.map(async v => {
                let a = await getTermTabsData(report_id,report_name,v.card)
                return a
             })
        )
         
        console.log(expExcel2Data,'---导出数据---')
        // expExcel2(report_name,expExcel2Data)
    }
    //活动期转化数据获取
    async function getTermTabsData(report_id,report_name,card) {
        let contrast = {
            触点:'trigger_point_name',
            ID:'trigger_point_id',
            曝光次数:'show_cnt',
            曝光人数:'show_uv',
            曝光人数:'show_uv',
            人均曝光次数:'show_avg',
            存量A1转化人数:'to_a4_cnt',
            存量A1转化率:'to_a4_rate',
        }

        let industry_id = await getIndustryId()
        let data = {
            aadvid:getQueryVariable('aadvid'),
            industry_id,
            brand_id:brands.brand_id,
            report_id,
            gta_type:1,
            analysis_type:1,
            card
        }
        let requestData = await fetchFun2(
            'https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaHarvestAnalysis',
            data
        )
        let res = requestData.data.ax_analysis.tps
        return {
            sheetName:`${report_name}_A${card}`,
            sheetData:res,
            sheetHeader:Object.keys(contrast),
            sheetFilter:Object.values(contrast),
            columnWidths: [], // 列宽
        }   
    }

    function expExcel() {
        let option={};
        option.fileName = fileName //文件名
        option.datas=sheetArr;
        console.log(option)
        var toExcel=new ExportJsonExcel(option);
        // toExcel.saveExcel();
        loadingMsg.close()
    }
    function expExcel2(e,data) {
        let option={};
        option.fileName = e //文件名
        option.datas=data;
        console.log(option)
        var toExcel=new ExportJsonExcel(option);
        toExcel.saveExcel();
        loadingMsg.close()
    }

    function urlClick() {
        fileName = 'GTA进行中活动数据'
        debounce = _.debounce(expExcel, 5000)
        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
        getQueryType(1)
    }
    function urlClick2() {
        fileName = 'GTA历史活动数据'
        debounce = _.debounce(expExcel, 5000)
        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
        getQueryType(2)
    }
    function urlClick3() {
        fileName = 'GTA自定义查询数据'
        debounce = _.debounce(expExcel, 5000)
        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
        getQueryType(3)
    }
})();
