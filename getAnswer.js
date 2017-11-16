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
         var $ = cheerio.load(html); //采用cheerio模块解析html
         console.log(html)
         //
         //
         //
         ++i;
         if(i==answerId.length){
         	return
         }
         var news_title = answerId[i].title
         savedContent(news_title);  //存储每篇文章的内容及文章标题
         var str = "http://zujuan.21cnjy.com/paper/view/"+answerId[i].listId
         fetchPage(str)
     });

 }).on('error', function (err) {
 	console.log(err);
 });
}


       //该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent(news_title) {
    fs.appendFile('./data/' + news_title + '.txt', 1111, 'utf-8', function (err) {
        if (err) {
            console.log(err);
        }
    });
}


fetchPage(url);      //主程序开始运行