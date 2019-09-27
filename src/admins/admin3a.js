const express = require('express')
const router = express.Router()

router.get('/admin3/:b1?/:b2?',(req,res)=>{
    const result = {
        params : req.params,
        url : req.url,
        baseUrl:req.baseUrl
    };
    res.json(result);
})

module.exports=router;


// module.exports = app =>{
//     app.get('/admin1/:p1?/:p2?',(req,res)=>{
//         res.json(req.params)
//     })
// }