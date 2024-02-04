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
      res.render('index', {data, loginStatus, userInfo})
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
  let date = req.params.id
  let email = req.session.user.email
  userHelpers.removeDiary(email, date).then((data) => {
    res.redirect('/pages')
  })
})

router.get('/edit/:id', (req, res) => {
  let date = req.params.id
  let email = req.session.user.email
  userHelpers.findDiary(email, date).then((editDiary) => {
    res.render('edit', { editDiary })
  })
})

router.post('/edit/:id', (req, res) => {
  let date = req.params.id
  let updatedDiary = req.body
  userHelpers.editDiary(updatedDiary, date).then((data) => {
    res.redirect('/pages')
  })
})

router.get('/view/:id', (req, res) => {
  let id = req.params.id
  let email = req.session.user.email
  userHelpers.findDiary(email, id).then((viewDiary) => {
    let diary = viewDiary[0].diary
    let content = viewDiary[0].diary.content.replace(/\r\n/g, '<br>');
    console.log("VIEW : "+diary)
    res.render('view', { diary, content })
  })
})


module.exports = router;
