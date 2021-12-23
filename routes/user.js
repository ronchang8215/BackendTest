const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  var uid = req.session.uid;
  var displayName = req.session.displayName;
  res.render('signin',{
    title: '登入成功',
    uid: uid,
    displayName: displayName
  })
});

module.exports = router;