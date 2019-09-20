const http = require('http');
const fs = require('fs');
//簡單範本:
//只要有發request 就會進到這 (***需求物件,回應物件)
const server = http.createServer((request, response)=>{
    fs.writeFile(
        __dirname + '/header01.json',//1參數檔名
        JSON.stringify(request.headers),//2存放內容，整個物件轉換成JSON字串
        error=>{
            console.log('save ok');//3Callback function發生錯誤會將錯誤
        }
    );
    
    //設定回應
    response.writeHead(200, { //包成物件，因為head可以設定很多個
        //設定200 /html
        'Content-Type': 'text/html'
    });
    //end 資料送完即結束
    response.end(`<h2>Hiiiii ${request.url}</h2>`);//url是***req的屬性
});

server.listen(3000);