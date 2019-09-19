const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response)=>{
    fs.writeFile(
        __dirname + '/header01.json',//1參數檔名
        JSON.stringify(request.headers),//2存放內容，整個物件轉換成JSON字串
        error=>{
            console.log('save ok');//3Callback function發生錯誤會將錯誤
        }
    );
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.end(`<h2>Hiiiii ${request.url}</h2>`);
});

server.listen(3000);