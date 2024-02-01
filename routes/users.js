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
  userHelpers.userCheck(user.email).then((userFound)=>{
    if(userFound){
      res.redirect('/users/login')
    }else{
      userHelpers.signupUser(user).then((data)=>{
        console.log(data)
        res.redirect('/')
      })
    }
  })
  
})

router.get('/login', (req,res)=>{
  res.render('users/login')
})

router.post('/login', (req, res)=>{
  let user = req.body
  userHelpers.loginCheck(user.email, user.password).then((userFound)=>{
    if(userFound){
      req.session.loggedIn = true
      req.session.user = userFound
      res.redirect('/')
    }else{
      res.redirect('/users/login')
    }
  })
})

router.get('/logout', (req,res)=>{
  console.log('LOGOUT : '+req.session.user)
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
