var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var csurf = require('csurf');
// var logger = require('morgan');
var db = require('./config/db');

var csrfProtection = csurf({ cookie: true });

// const db = require('./config/db');

const app = express();
const port = 7000;

var check = function(req, res, next) {
  if(req.session.uid){
    return next();
  }
  res.redirect('/login');
}

//view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set public
app.use(express.static(path.join(__dirname, 'public')));

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.render('index', {
    title:'heyyoman'
  });
});

// app.get('/signin', function (req, res) {
//   let articles = [
//     {title:'one'},
//     {title:'two'},
//     {title:'three'}
//   ];
//   res.render('signin', {
//     title:'signin',
//     articles:articles
//   });
// })

//routes
let user = require('./routes/user');
app.use('/user' ,check , user);

let authRouter = require('./routes/auth');
app.use('/login',authRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


db.ref('user').once('value', function (snapshot) {
  console.log(snapshot.val());
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
