const express = require('express');
const app = express() //1建立app或server物件 本身就是function

app.set('view engine','ejs');

app.use(express.static('public'));
// routes 路由

app.get('/',(req,res)=>{//定義路由，路由是個字串，一律從根目錄開始
    // res.send('hiii'); //res
    res.render('home',{name:'Arwen',a:123});
});

app.get('/002',(req,res)=>{
    res.send('~~~~~~~~~')
})

app.use((req,res)=>{
    res.type('text/plain')
    res.status(404)
    res.send('404 找不到頁面。')
})


app.listen(3000, ()=>{
    console.log('server started 3000')
});

