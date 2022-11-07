// ==UserScript==
// @name         直播间分析
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://yuntu.oceanengine.com/yuntu_ng/brand/live?*
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
    button.textContent = "导出数据"; //按钮内容
    button.style.height = "32px"; //高
    button.style.lineHeight = "32px"; //行高
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#1f4bd9"; //按钮底色
    button.style.border = "0px"; //边框属性
    button.style.borderRadius = "0px"; //按钮四个角弧度
    button.style.marginLeft = '10px';
    button.style.fontSize = '14px';
    button.style.padding = '0 15px';
    button.addEventListener("click", urlClick); //监听按钮点击事件

    //message.js
    let loadingMsg = null
    let loadingMsg1 = null

    //品牌
    let brandObj = {
        '1713573417704462': 'SSS',
        '1716472555224075': '奶糖派NTP',
        '1718566610217988': '南国食品旗舰店',
        '1718731435013124': 'beautigo',
        '1726899190084611': 'Kate Somerville海外旗舰店',
        '1729546814550019': "让缇丝Jean d'estrées",
        '1730713495040007': '科施佳官方旗舰店',
        '1732519757634573': 'xinmei@golong.cn',
        '1733594070401032': 'Sepai',
        '1736238360556548': '杭州天萃诗化妆品有限公司',
        '1739400043457611': '瑞斐时天津碧捷',
        '1744999758913544': 'HORMETA欧米达',
        '1648829120397320': 'Filorga/菲洛嘉',
        '1696356811251726': 'HADAY/海天',
        '1648829117571079': 'Nivea/妮维雅',
        '1648829118742542': 'HomeFacialPro',
        '1672744346769421': 'Mionsoo/棉上',
        '1702602772284429': 'AUX/奥克斯',
        '1696356998849550': 'Bear/小熊',
        '1672744362622983': 'Baby elephant/红色小象',
        '1657598035549197': 'OLAY/玉兰油',
        '1657598044429383': 'BIOHYALUX/润百颜',
        '1672744296373261': 'a2/至初',
        '1672744348379143': '最生活',
        '1672744376680456': 'MANTING/满婷',
        '1672744368166926': 'pwu/朴物大美',
        '1703060893535310': 'UNISKIN/优时颜',
        '1679081331241997': 'ClorisLand/花皙蔻',
        '1710507460462600': 'Bb LABORATORIES/苾莱宝',
        '1702602792209421': 'BRITA/碧然德',
        '1696356993701902': 'FLYCO/飞科',
        '1696356967609421': 'PMPM',
        '1703060791743559': 'RELLET/颐莲',
        '1708581408431111': 'timage/彩棠',
        '1715399324706823': 'Dermalogica/德美乐嘉',
        '1713035750084616': '肌肉科技',
        '1696356873768974': '官栈',
        '1713035741929479': 'MOODY',
        '1713035776524360': '猎聘',
        '1703060860826648': 'Prof.Ling/凌博士',
        '1696356964662285': 'LUONENG/罗能',
        '1696356991309896': 'Ulike',
        '1702602808232974': 'JINKAIRUI/金凯瑞',
        '1713035768359943': 'Zhong An Insurance/众安保险',
        '1726246245022727': '书亦烧仙草',
        '1726246207527048': '可复美',
        '1728619073817672': 'BeautiGO',
        '1728619134274567': '奶糖派',
        '1731407696747534': 'MURAD',
        '1731407714116622': 'OVF',
        '1737060287995918': "JEAND'ESTREES/让缇丝"
    }

    //导出文件名
    let fileName = ''

    //默认GET请求
    const getRequestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    setTimeout(() => {
        var like_comment = document.getElementsByClassName('index__analyseBtnWrap--sPpO7')[0];
        like_comment.append(button); //把按钮加入到 x 的子节点中
    }, 2000);

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

    //封装网络请求
    function fetchFun2(url,data={}, requestOptions=getRequestOptions){
        const urlData = Object.keys(data).map(v => `${v}=${data[v]}`).join('&')
        return fetch(`${url}?${urlData}`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    return JSON.parse(result)
                })
                .catch(error => console.log('error', error));
    }

    let period_type_obj = [
        {key:'近7天',value:7},
        {key:'近30天',value:30},
        {key:'按周',value:-2},
        {key:'按月',value:-1},
        {key:'按月',value:-1},
        {key:'今年618',value:32},
        {key:'今年818',value:818},
    ]
    //获取用户筛选条件
    async function getIndustryId(){
        let industryValue1 = document.getElementsByClassName('byted-input-size-md')[0].value
        let industryValue2 = document.getElementsByClassName('byted-input-size-md')[1].value.split('~')[1].trim()
        let industryValue = period_type_obj.filter(v=>v.key === industryValue1)[0].value
        return {
            period_type:industryValue,
            end_date:industryValue2
        }
    }


    //抖音账号获取
    async function getDouYin() {
        // let industry_id = await getIndustryId()
        let names = document.getElementsByClassName('index__name--3s-bG')[0].childNodes[0].innerHTML
        let data = {
            aadvid:getQueryVariable('aadvid')
        }
        let requestData = await fetchFun2(
            'https://yuntu.oceanengine.com/yuntu_ng/api/v1/GetBrandAccountList',
            data
        )
        let res = requestData?.data
        let account_id = res.filter((v)=>{
           return v.aweme_name === names
        })[0].bluev_id
        return account_id
    }

    let level_1_industry_id = 12
    //直播间获取
    async function getTabsData() {
        let account_id = await getDouYin()
        let userdata = await getIndustryId()
        let data = {
            ...userdata,
            aadvid:getQueryVariable('aadvid'),
            level_1_industry_id,
            account_id,
            rank_type:5
        }
        let requestData = await fetchFun2(
            'https://yuntu.oceanengine.com/yuntu_ng/api/v1/GetBrandAccountRoomList',
            data
        )
        let res = requestData?.data?.room_list
        // console.log(res)
        if (res.length >= 15) {
            loadingMsg.close()
            loadingMsg1 = Qmsg.loading(`数据较多，请耐心等待（共${res.length}个直播间）`);
        }
        res.forEach(v => {
            getDataPerformance(v.room_id,v.room_title,v.live_start_time,v.duration_second,res.length)
        });
    }

    let arrData = []
    //整体数据表现
    async function getDataPerformance(room_id,room_title,live_start_time,duration_second,i){
        let contrast = {
            '直播间ID':'room_id',
            '直播间名称':'room_title',
            '开播时间':'live_start_time',
            '直播时长':'duration_second',
            '流量(看播用户数)':'llcnt',
            '内容(人均停留时长)/秒':'nrcnt',
            '转化(订单金额)':'zhcnt',
            '粉丝订单金额':'jecnt',
            '口碑':'kbcnt'
        }
        let userdata = await getIndustryId()
        let account_id = await getDouYin()
        let data = {
            ...userdata,
            aadvid:getQueryVariable('aadvid'),
            room_id,
            level_1_industry_id,
            main_brand_id:brands.brand_id,
            account_id,
        }
        let requestData = await fetchFun2(
            'https://yuntu.oceanengine.com/yuntu_ng/api/v1/GetBrandAccountRoomData',
            data
        )
        let res = requestData?.data?.room_data
        let datas = {
            room_id,
            room_title,
            live_start_time,
            duration_second:`${moment.duration(+duration_second*1000).hours()}h${moment.duration(+duration_second*1000).minutes()}min${moment.duration(+duration_second*1000).seconds()}s`
        }
        res.map(v=>{
            let cntName = v.room_data_type == 1 ? 'llcnt' : v.room_data_type == 2 ? 'nrcnt' : v.room_data_type == 3 ? 'zhcnt' : v.room_data_type == 4 ? 'jecnt' : 'kbcnt'
            datas[cntName] = v?.cnt
        })
        arrData.push(datas)
        document.getElementsByClassName('qmsg-content-loading')[0].childNodes[2].innerHTML=`导出进度：${Math.round(arrData.length/i * 100)}%`
        if (arrData.length === i) {
            let expData = {
                sheetName:`${userdata.end_date} 直播间整体数据`,
                sheetData:arrData.length?arrData:[{}],
                sheetHeader:Object.keys(contrast),
                sheetFilter:Object.values(contrast),
                columnWidths: [], // 列宽
            }
            expExcel(expData)
            arrData = []
        }
    }

    function expExcel(e) {
        let option={};
        option.fileName = fileName //文件名
        option.datas=[e];
        console.log(option)
        var toExcel=new ExportJsonExcel(option);
        toExcel.saveExcel();
        if (loadingMsg1) loadingMsg1.close()
        loadingMsg.close()
    }
    
    function urlClick() {
        fileName = `${brandObj[getQueryVariable('aadvid')]}${moment().format("YYYYMMDDHHmmss")}整体数据表现`
        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
        getTabsData()
    }
})();
