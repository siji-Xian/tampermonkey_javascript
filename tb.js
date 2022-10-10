// ==UserScript==
// @name         贴吧自动评论
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tieba.baidu.com/p/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //触发评论按钮
    function click(){
     let para = document.getElementsByClassName("poster_submit")[0];
     para.click()
    }

    function addComment(e){
        let para = document.createElement("p");
        let node = document.createTextNode(`顶${moment().format("YYYY-MM-DD HH:mm:ss")}`);
        para.appendChild(node);
        let element = e
        element.appendChild(para);
        click()
    }

     setInterval(() => {
      let dom = document.getElementById('ueditor_replace')
      addComment(dom)
    }, 60000);

})();