var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var url = "http://zujuan.21cnjy.com/paper/index?page=1&per-page=10"
var list = []
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
         var $ = cheerio.load(html); //采用cheerio模块解析html
         var li = $(".search-list").find("li")
         var page =$(".pagenum").find("a").last()
         li.each(function(){
         	var target = $(this).find(".test-txt").find("p").eq(0).find("a")
         	var targetData = {
         		title:target.text().trim(),
         		listId:target.attr("href").replace(/[^0-9]/ig,"")
         	}
         	list.push(targetData)
         })
         fs.appendFile('data.txt',JSON.stringify(list,null,4),'utf-8', function (err) {
         		if (err) {
         			console.log(err);
         		}
         	});	
         	console.log(list)
         var nextLink="http://zujuan.21cnjy.com/" + page.attr('href');
         if(page.text()=='下一页'){//递归
         	fetchPage(nextLink)
         }
     });
 }).on('error', function (err) {
 	console.log(err);
 });
}
fetchPage(url);      //主程序开始运行