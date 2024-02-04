var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/users/signup')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loggedIn) {
    let loginStatus = true
    let userInfo = req.session.user
    let email = req.session.user.email
    userHelpers.getAllDiary(email).then((data) => {
      
      res.render('index', { data, loginStatus, userInfo})
    })
  }else{
    let loginStatus = false
    res.render('index', { loginStatus });
  }
});

router.get('/compose', verifyLogin, (req, res) => {
  let loginStatus = true
  let userInfo = req.session.user
  res.render('compose', { loginStatus, userInfo })
})

router.post('/compose', (req, res) => {
  let diary = {
    date: req.body.date,
    content: req.body.content,
    limitContent: req.body.content.slice(0, 60)
  }

  let userInfo = req.session.user
  let email = req.session.user.email
  console.log(email)

  userHelpers.addDiary(email, diary).then((data) => {
    // console.log("Diray : "+data)
    res.redirect('/')
  })
})

router.get('/pages', verifyLogin, (req, res) => {
  let loginStatus = true
  let userInfo = req.session.user
  let email = req.session.user.email
  userHelpers.getAllDiary(email).then((data) => {
    // console.log(diary)
    res.render('pages', { data, loginStatus, userInfo });
  })
})

router.get('/delete/:id', (req, res) => {
  let id = req.params.id
  let email = req.session.user.email
  userHelpers.removeDiary(email, id).then((data) => {
    res.redirect('/pages')
  })
})

router.get('/edit/:id', (req, res) => {
  let id = req.params.id
  let email = req.session.user.email
  userHelpers.findDiary(email, id).then((data) => {
    let editDiary = data[0].diary
    res.render('edit', { editDiary })
  })
})

router.post('/edit/:id', (req, res) => {
  console.log('reached!')
  let id = req.params.id
  let email = req.session.user.email
  let updatedDiary = {
    date: req.body.date,
    content: req.body.content,
    limitContent: req.body.content.slice(0, 60)
  }
  console.log("EDITED : "+updatedDiary)
  userHelpers.editDiary(email, updatedDiary, id).then((data) => {
    res.redirect('/pages')
  })
})

router.get('/view/:id', (req, res) => {
  let id = req.params.id
  let email = req.session.user.email
  userHelpers.findDiary(email, id).then((viewDiary) => {
    let diary = viewDiary[0].diary
    let content = viewDiary[0].diary.content.replace(/\r\n/g, '<br>');
    // console.log("VIEW : "+diary)
    res.render('view', { diary, content })
  })
})

router.get('/profile', verifyLogin, (req, res) => {
  let loginStatus = true
  let email = req.session.user.email
  let userInfo = req.session.user
  userHelpers.getAllDiary(email).then((diaries)=>{
    let length = diaries.diary.length
    console.log("Diaries : "+diaries.diary.length)
    let diary = diaries.diary
    res.render('profile', {loginStatus, userInfo, diary, length})
  })
})


module.exports = router;
