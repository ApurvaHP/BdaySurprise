var express = require('express'); //Variables tied with dependecies, routes, modules, packages
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//New Code - for mongodb connection
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://root:root@ds035617.mongolab.com:35617/nodebdayproj');

var routes = require('./routes/index'); //routes variable is pointing at index router
var users = require('./routes/users');

var app = express(); //instantiates express and assigns our app variable to it

// view engine setup
app.set('views', path.join(__dirname, 'views')); //configuring a bunch of express stuff using app
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//below lines establishing middleware for express, providing custom functions, b4 route so that they can make use of it
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //telling Express to serve static objects from the /public/ dir, but to make them actually seem like they're coming from the top level 

//Make our db accessible to the routes, this is only suboptimal
app.use(function(req,res,next){
    req.db = db; //monk object created above is being added to every http request the app makes
    next(); //read wat this is?
});

app.use('/', routes); 
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err); //what is this?
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


module.exports = app; //exporting app object so that it can be called elswher in the code
