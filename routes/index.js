var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  userHelpers.getAllDiary().then((diary)=>{
    console.log(diary)
    res.render('index', {diary});
  })
});

router.get('/compose', (req,res)=>{
  res.render('compose')
})

router.post('/compose', (req,res)=>{
  let diary = {
    date: req.body.date,
    content: req.body.content,
    limitContent: req.body.content.slice(0,60)
  }

  userHelpers.addDiary(diary).then((data)=>{
    console.log("Diray : "+data)
    res.redirect('/')
  })
})

router.get('/pages', (req,res)=>{
  userHelpers.getAllDiary().then((diary)=>{
    console.log(diary)
    res.render('pages', {diary});
  })
})

router.get('/edit', (req,res)=>{
  res.render('edit')
})

router.get('/delete/:id', (req,res)=>{
  let id = req.params.id
  userHelpers.removeDiary(id).then((data)=>{
    res.redirect('/pages')
  })
})

module.exports = router;
