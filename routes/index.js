var express = require('express');
const {sign,getData, userDataIsThere} = require('../model/sign');
var router = express.Router();
const {setAppData}=require('../model/appli')
let jwt = require('jsonwebtoken')



router.post('/sign', function (req, res) {

  sign(req.body).then(result => {
    if(!result.data){
      res.json({url:`/login?status`,status:result.status})
    }
    else{

      res.json({url:`/signup?status`,status:result.status})
    }
   
  })
});



router.post('/login', function (req, res) {

  getData(req.body).then(result => {
    if(result.data){
      console.log(result.data,"from get data")
    
      let token = jwt.sign(result.data,'cat')
      
      res.json({url:`/?token=${token}`,status:result.status})
    }else {
      res.json({url:`/login?status=${result.status}`,status:result.status})
    }
   
  })
});



router.post('/application', function (req, res) {

  setAppData(req.body).then(() => {
    res.redirect('http://localhost:3000/')
  })
});

router.patch('/userData',(req,res)=>{
  console.log(req.body)
  
  userDataIsThere(req.body).then(resp=>{
   res.json({isThere:resp?true:false,userData:resp})
  })
})

module.exports = router;
