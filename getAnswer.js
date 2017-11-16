var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0
var answerId = JSON.parse(fs.readFileSync('data.txt','utf-8'))//同步读取

var url = "http://zujuan.21cnjy.com/paper/view/"+answerId[0].listId

function fetchPage(x) {     //封装了一层函数
	startRequest(x); 
}

function startRequest(x) {
     //采用http模块向服务器发起一次get请求      
     http.get(x, function (res) {     
        var html = '';        //用来存储请求网页的整个html内容     
        res.setEncoding('utf-8'); //防止中文乱码
     //监听data事件，每次取一块数据
     res.on('data', function (chunk) {   
     	html += chunk;
     });
     //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
     res.on('end', function () {
         ++i;
         if(i==answerId.length){
            return
         }	
         var $ = cheerio.load(html); //采用cheerio模块解析html
         var news_title = answerId[i].title

         var data = {}
         data.examName = news_title
         data.examCont = []



         savedContent(news_title,data);  
         var str = "http://zujuan.21cnjy.com/paper/view/"+answerId[i].listId
         fetchPage(str)
     });

 }).on('error', function (err) {
 	console.log(err);
 });
}


function getBigQuestionTitle(ele){//获取最大提标题   'preview-body'
    var examCont = [] 
    var itme = $('.'+ele).find(".search-list")
    itme.each(function(index,itme){
        var title = {}
        title.bigQuestionName = $(this).prev("h3").text().trim()
        title.questionGroup = []
        getItemQuestionTitle($(this),title)
        examCont.push(title)
    })
    return JSON.stringify(examCont,null,4)
}

function getItemQuestionTitle(ele,obj){ //获取大题中小题  'search-list'
    var questionGroup = obj.questionGroup
    var itme = ele.find("li")
    itme.each(function(){
        var itmeObj = {}
        itmeObj.itemName = $(this).find(".exam-q").text().trim()
        itmeObj.itmeCont = []
        questionGroup.push(itmeObj)
        getOptionsCont($(this),itmeObj)
    })
}

function getOptionsCont(ele,obj){ //获取选项内容    'op-item'
    var itmeCont = obj.itmeCont
    var itme = ele.find(".op-item")
    itme.each(function(){
        var opt = {}
        opt.option = $(this).find(".op-item-meat").text().trim()
        itmeCont.push(opt)
    })
}

getBigQuestionTitle('preview-body')

function savedContent(news_title,data) {
    fs.appendFile('./data/' + news_title + '.txt', JSON.stringify(data,null,4), 'utf-8', function (err) {
        if (err) {
            console.log(err);
        }
    });
}


fetchPage(url);      //主程序开始运行