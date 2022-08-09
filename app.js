var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const routes = require('./routes/index');
const books = require('./routes/books');

var app = express();

//
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db',
});

//Test connection db and sync the model
(async () => {
  // Sync 'Book' table 
  await sequelize.sync({ force: true });   
  try {   
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) { 
    console.error('Error connecting to the database: ', error); 
  } 
})();  

//

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade'); 
//UPDATE
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);.
app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//P6 404 Error Handler
app.use((req, res, next) => {
  // console.log('404 error handler called');
  // const err = new Error('Oops, page not found. Looks like that route does not exist.');
  // err.status = 404;
  // next(err);
  next(createError(404, 'Oops, page not found. Looks like that route does not exist.'));
});

//P6 Global error handler
app.use((err, req, res, next) => {
  // console.log('Global error handler called', err);
  if(err.status === 404){
    console.error(`${err.status} - ${err.message}`);
    res.render('page-not-found', { err });
  } else {
    // res.locals.message = err.message;
    err.message = 'Oops! It looks like something went wrong on the server.';
    console.error(`${err.status} - ${err.message}`);
    // res.status(err.status || 500);
    // err.status(err.status || 500);
    err.status = 500;
    res.render('error', { err })
  }
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
