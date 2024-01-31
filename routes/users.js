var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')

/* GET users listing. */
router.get('/signup', (req,res)=>{
  res.render('users/signup')
})

router.post('/signup',(req,res)=>{
  let user = req.body
  // console.log('USER : '+user)
  userHelpers.signupUser(user).then((data)=>{
    console.log(data)
    res.redirect('/')
  })
})

router.get('/login', (req,res)=>{
  res.render('users/login')
})

module.exports = router;
