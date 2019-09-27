const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads' });
const fs = require('fs');
const session = require('express-session');
const moment = require('moment-timezone');
const mysql = require('mysql');
const bluebird = require('bluebird');
const cors = require('cors');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Arwen',
    password: '4595',
    database: 'ac_pbook'
})
db.connect();

bluebird.promisifyAll(db);

const app = express() //1建立app或server物件 本身就是function
// const urlencodedParser = bodyParser.urlencoded({extended: false});
//const ↑ 需掛urlencodedParser才會進行解析，故改成下方app.use的方式就不用
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'fsdfdsfdsfdsf',
    cookie: {
        maxAge: 120000,
    }
}))

// routes 路由
app.get('/', (req, res) => {//定義路由，路由是個字串，一律從根目錄開始
    // res.send('hiii'); //res
    res.render('home', { name: 'Arwen', a: 123 });
});

// app.use('/',(req,res)=>{
//     res.send('有人進來了')
//     next()
// })
//偽裝
app.get('/b.html', (req, res) => {//定義路由，路由是個字串，一律從根目錄開始
    res.send(`<h1>這是假的動態網站!</h1>`)
});

app.post('/sales01', (req, res) => {
    const sales = require('./../data/sales01')

    //res.send(JSON.stringify(sales));
    //res.json(sales);
    res.render('sales01', {
        sales: sales
    });
});
//0920
app.get('/try-qs', (req, res) => {
    const urlParts = url.parse(req.url, true);
    console.log(urlParts);

    res.render('try-qs', {
        query: urlParts.query
    });
});

app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
});

// app.post('/try-post-form',urlencodedParser,(req, res)=>{
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);//進ejs相對應變數
    // res.send(JSON.stringify(req.body))
});

app.get('/try-post-form2', (req, res) => {
    res.send('get:try-post-form2')
})
app.post('/try-post-form2', (req, res) => {
    res.json(req.body);
    //postman測試
})
app.put('/try-post-form2', (req, res) => {
    res.send('put:try-post-form2')
})

app.post('/try-upload', upload.single('avatar'), (req, res) => {
    if (req.file && req.file.originalname) {
        console.log(req.file);
        switch (req.file.mimetype) {
            case 'image/png':
            case 'image/jpeg':
                fs.createReadStream(req.file.path)
                    .pipe(
                        fs.createWriteStream('public/img/' + req.file.originalname)
                    );
                res.send('ok');
                break;
            default:
                return res.send('bad file type');
        }
    }
    else {
        res.send('no upload');
    }
});
// 0925 
app.get('/my_params1/:action?/:id?', (req, res) => {
    res.json(req.params)
})

app.get('/my_params2/*?/*', (req, res) => {
    res.json(req.params)
})
//split陣列索引
app.get(/^\/09\d{2}\-?\d{3}-?\d{3}$/, (req, res) => {
    let = str = req.url.slice(1)
    str = str.split('?')[0]
    str = str.split('-')
    res.send('手機:' + str)
})

// 路由模組化1
//引入範例練習
// const admin1 = (_dirname+'/path');
// admin1(app)

const admin1 = require(__dirname + '/admins/admin1');
admin1(app);

//路由模組化2
app.use(require(__dirname + '/admins/admin2'));
app.use('/admin3', require(__dirname + '/admins/admin3'));
// 0925

//0926
//session 造訪次數
app.get('/try-session', (req, res) => {
    req.session.my_views = req.session.my_views || 0;
    req.session.my_views++;

    res.json({
        'name:': 'tom',
        'age': 20,
        'my views': req.session.my_views
    });
})

//moment 顯示時間
app.get('/try-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const mo1 = moment(req.session.cookie.expires);
    // const mo2 = moment(new Date());
    res.contentType('text/plain');
    res.write(req.session.cookie.expires + '\n');
    res.write(new Date() + '\n');
    res.write(mo1.format(fm) + '\n');
    // res.write(mo2.format(fm)+'\n');
    res.write(mo1.tz('Asia/taipei').format(fm) + '\n');
    // res.write(mo2.tz('europe/london').format(fm)+'\n');
    res.end('');
})

//撈資料庫
app.get('/try-db', (req, res) => {
    const sql = 'SELECT `AC_sid`, `AC_name`, `AC_title`,`AC_date` FROM `ac_pbook` WHERE `AC_name` LIKE ?'
    db.query(sql, ["%肥宅先生%"], (error, results, fields) => {
        console.log(error)
        console.log(results)
        console.log(fields)
        // res.json(results)

        res.render('try-db', {
            rows: results
        });
    });
});

//0926

//0927
// 撈資料2
app.get('/try-db2:page?', (req, res) => {
    let page = req.params.page || 3;
    let perPage = 2;
    let output = {};

    db.queryAsync('SELECT COUNT (1) total FROM `AC_pbook`')
        .then((results) => {
            // res.json(results)
            output.total = results[0].total;
            return db.queryAsync(`SELECT * FROM AC_pbook LIMIT ${(page - 1) * perPage},${perPage}`)
        })
        .then(results => {
            output.rows = results;
            res.json(output);
        })
        .catch(error => {
            console.log(error)
        })

});

        app.get('/json-test', (req, res) => {
            res.render('json-test');
        });
//0927

app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 找不到頁面。')
})

app.use((err,req,res,next)=>{
    console.error(err.stack)
    res.status(500).send('<h1>程式出錯了！</h1>')
})

app.listen(3000, () => {
    console.log('server started 3000')
});

