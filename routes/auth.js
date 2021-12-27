const express = require('express');
const router = express.Router();
var firebase = require('../config/connection');
require("firebase/auth");
var check = require('express-validator/check').check;
var validationResult = require('express-validator/check').validationResult;

const validat = [
  check('email').isEmail().withMessage('Email 格式錯誤'),
  check('password').isLength({ min: 8 }).withMessage('密碼不可少於 8 字元'),
  check('username').isLength({ min: 2 }).withMessage('姓名不可低於 2 個字元')
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { 
    title: '登入畫面',
    success: req.flash('info')
  });
});

router.post('/signin', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(user) {
    req.session.uid = user.user.uid;
    req.session.displayName = user.user.displayName;
    res.redirect('/user');
  })
  .catch(function(error) {
    // Handle Errors here.
    // var errorCode = error.code;
    var errorMessage = error.message;
    req.flash('info', errorMessage);
    res.redirect('/login/');
  });
});

router.get('/signup', function(req, res, next) {
  res.render('register', {
    success: req.flash('info'),
    tryagain: req.flash('warning'),
    errors: req.flash('error'),
    title: '註冊帳號'
  });
});

router.post('/signup',validat, function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('warning',errors.array());
    return res.redirect('/login/signup');
  }
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(userCredentials) {
    userCredentials.user.updateProfile({ displayName: username });
    req.flash('info','註冊成功');
    res.redirect('/login/signup');
  })
  .catch(function(error) {
    // Handle Errors here.
    // var errorCode = error.code;
    var errorMessage = error.message;
    req.flash('error', errorMessage);
    res.redirect('/login/signup');
  });
});

//logout
router.post('/logout', (req, res) => {
  req.session.uid = '';
  res.redirect('/login/');
});

module.exports = router;
