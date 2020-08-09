'use strict';

const { use } = require('./routes/users');

module.exports = (mongoose) => {

  var createError = require('http-errors');
  var express = require('express');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');


  var userService = require('./services/users');
  // const usersmiddleware = require('./middleware/user')(userService);

  var passport = require('./config/passport')(userService);
  var session = require('./middleware/sessions');
  var service = require('./services/games')(mongoose);
  var indexRouter = require('./routes/index')(service);
  var usersRouter = require('./routes/users');
  var gamesRouter = require('./routes/games')(service);

  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'hjs');

  if(app.get('env') === 'development'){
    app.use(logger('dev'));
  }
  app.use(session);
  app.use(passport.initialize());
  app.use(passport.session());
  const addAuthEndpoints = provider => {
    app.post(`/auth/${provider}`, passport.authenticate(provider));
    app.get(`/auth/${provider}/callback`, 
        passport.authenticate(provider, {
          successRedirect: '/',
          failureRedirect: '/',
          session: true}));
  }
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
 
  app.use(express.static(path.join(__dirname, '../public')));

  // app.use(usersmiddleware);
  addAuthEndpoints('twitter');
  addAuthEndpoints('facebook');
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/games', gamesRouter);

  if (process.env.NODE_ENV === 'test') {
    app.post('/auth/test',
    passport.authenticate('local', { successRedirect: '/' }));
  }

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

  return app;
};
