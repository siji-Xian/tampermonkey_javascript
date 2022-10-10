// ==UserScript==
// @name         店铺商品ID导出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://yuntu.oceanengine.com/yuntu_ng/analysis/audience/create?*
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://cuikangjie.github.io/JsonExportExcel/dist/JsonExportExcel.min.js
// ==/UserScript==

(function () {
    "use strict";
    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "导出ID"; //按钮内容
    button.style.width = "80px"; //按钮宽度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#1f4bd9"; //按钮底色
    button.style.border = "1px solid #1f4bd9"; //边框属性
    button.style.borderRadius = "5px"; //按钮四个角弧度
    button.style.position = 'absolute';
    button.style.left = '130px';
    button.style.fontSize = '12px';
    button.style.zIndex = '510';
    button.addEventListener("click", urlClick); //监听按钮点击事件

    let brand = localStorage.getItem('__Garfish__platform__yuntu_user') || ''
    let brandId = JSON.parse(brand)
    setTimeout(() => {
        $('.index__card--3PVMw').click(function(){
            setTimeout(() => {
                var like_comment = document.getElementsByClassName('byted-content-header')[0];
                like_comment.append(button); //把按钮加入到 x 的子节点中
            }, 1000);
        })
    }, 2000);

    //数据扁平化+拼接
    let getYtStr = (e) => {
        let ytString = [];
        e.map((v) => {
            let a = [];
            if (v.children.length > 0) {
                v.children.map((item) => {
                    a.push({
                        label: v.label + "/" + item.label,
                        value: item.value,
                    });
                    if(item.children.length>0){
                        item.children.map((p) => {
                            a.push({
                                label: v.label + "/" + item.label + "/" + p.label,
                                value: p.value,
                            });
                        });
                    }
                });
            }
            ytString.push(...a, {label:v.label,value:v.value});
        });
        return ytString;
    };


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

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    let GetShopDetailData;
    let GetProductCategoryData;
    //获取店铺列表
    fetch(`https://yuntu.oceanengine.com/yuntu_ng/api/v1/GetShopDetail?aadvid=${getQueryVariable('aadvid')}`, requestOptions)
        .then(response => response.text())
        .then(result => {
        GetShopDetailData = JSON.parse(result).data.shop_details
    })
        .catch(error => console.log('error', error));
    //获取类目列表
    fetch(`https://yuntu.oceanengine.com/yuntu_ng/api/v1/GetProductCategory?aadvid=${getQueryVariable('aadvid')}`, requestOptions)
        .then(response => response.text())
        .then(result => {
        GetProductCategoryData=getYtStr(JSON.parse(result).data)
    })
        .catch(error => console.log('error', error));

    //获取选中的参数
    async function getUserShop(){
        let arr = []
        $.each($('.byted-input'),function(index,item){
            arr.push(item.value)
        })
        let splitValue2 = arr[2]
        let userShop = GetShopDetailData?.filter(item=>{
            return item.name === arr[1]
        })[0]?.id

        let userProduct = GetProductCategoryData?.filter(item=>{
            let b = item.label
            let d = splitValue2
            return b === d
        })[0]?.value

        return {
            name:arr[1]+'-'+arr[2],
            shopId:userShop,
            productId:userProduct
        }
    }


    async function urlClick(){
        getUserShop().then(res=>{
            if(!res.shopId || !res.productId){
                alert('请先完成条件选择！')
                return
            }
            fetch(`https://yuntu.oceanengine.com/yuntu_ng/api/v1/analysis_insight/SmallShopList?aadvid=${getQueryVariable('aadvid')}&category_id=${res.productId}&shop_id=${res.shopId}&brand_id=${brandId.brand_id}`, requestOptions)
                .then(response => response.text())
                .then(result => {
                let expData = JSON.parse(result)?.data?.commodity_info_list
                if(expData.length === 0) {
                    alert('请确保数据不为空！')
                    return
                }
                
                let option={};
                option.fileName = res.name //文件名
                option.datas=[
                    {
                        //第一个sheet（第一个excel表格）
                        sheetData:expData,//数据
                        sheetName:'sheet',
                        sheetFilter:['product_name','product_id'],   //表头数据对应的sheetData数据
                        sheetHeader:['product_name','product_id'],  //表头数据
                        columnWidths: ['60','60'], // 列宽
                    }
                ];
                var toExcel=new ExportJsonExcel(option);
                toExcel.saveExcel();

                
            })
                .catch(error => console.log('error', error));
        })
    }

})();
