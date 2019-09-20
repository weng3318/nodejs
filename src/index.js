const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');

const app = express() //1建立app或server物件 本身就是function
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine','ejs');

app.use(express.static('public'));
// routes 路由

app.get('/',(req,res)=>{//定義路由，路由是個字串，一律從根目錄開始
    // res.send('hiii'); //res
    res.render('home',{name:'Arwen',a:123});
});

app.post('/sales01',(req,res)=>{
    const sales = require('./../data/sales01')

    //res.send(JSON.stringify(sales));
    //res.json(sales);
    res.render('sales01', {
        sales:  sales
    });
});
//0920
app.get('/try-qs', (req, res)=>{
    const urlParts = url.parse(req.url, true);
    console.log(urlParts);

    res.render('try-qs', {
        query:  urlParts.query
    });
});

app.get('/try-post-form', (req, res)=>{
    res.render('try-post-form');
});
app.post('/try-post-form',(req, res)=>{
    res.render('try-post-form', req.body);
    // res.send(JSON.stringify(req.body))
});

app.use((req,res)=>{
    res.type('text/plain')
    res.status(404)
    res.send('404 找不到頁面。')
})


app.listen(3000, ()=>{
    console.log('server started 3000')
});

