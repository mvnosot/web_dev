var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// conn생성
mongoose.connect("mongodb://scott:tiger@ds011963.mlab.com:11963/testmg");
var db = mongoose.connection;

db.once("open", function() {
  console.log("DB connected");
});
db.on("error",function(err){
console.log("DB error : " + err)
});

// Model
var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});
var Data = mongoose.model('data', dataSchema);
Data.findOne({name:"myData"}, function(err, data) {
  if(err) return console.log("Data EROOR: ", err);
  if(!data) {
    Data.create({name:"myData", count:0}, function(err, data) {
      if(err) return console.log("Data EROOR: ", err);
      console.log("Counter initialized: ", data);
    });
  }
});

var roomSchema = mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
})
var Room = mongoose.model('room',roomSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// add bodyParser - get data from body(view) by json
app.use(bodyParser.json());

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
