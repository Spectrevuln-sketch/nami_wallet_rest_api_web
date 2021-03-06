var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// package loader
var cors = require('cors');
const mongoose = require('mongoose');
const ConfigStore = require('./config/storageCong')



mongoose.connect(ConfigStore.mongodb.url, async (err) => {
  if (err) throw err
  console.log("Connected To Database No Sql")
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cardanoRouter = require('./routes/cardano');
var app = express();

/** Cors Setup */
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/v1', cardanoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
