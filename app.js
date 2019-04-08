var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const Authentication = require('./auth');

const authConfig = require('./auth-config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Original file routes
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// app.use(Authentication.filter());

const handleProtectedResource = (req, res) => {
    const principal = res.locals.principal;
    const localUser = userStore.get(principal.sub);
    const name = localUser ? localUser.name : principal.sub;
    res.json({
        user: name
    }).end();
  }

  const handleTokenRequest = (req, res) => {
    try {
        const login = req.body;
      auth.authenticate(login).then(credentials => {
        
        userStore.push(credentials.user);
        res.json(credentials).end();
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' }).end();
    } finally {
    }
  }

app.post('/auth/token', handleTokenRequest);
app.get('/protected', handleProtectedResource);

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
