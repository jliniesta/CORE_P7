//Es el fichero donde se configura el comportamiento del servidor

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var partials = require('express-partials');
var indexRouter = require('./routes/index'); //Se carga las routas del fichero indice

var app = express();

// view engine setup -> se configura el motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//es donde se cargan todos los middewares que hay que ejecutar uno detras de otro para una peticion de un cliente
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials()); 

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404)); //si la peticion no se ha encontrado
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500); //Para atender un error producido en cualquier middleware anterior
  res.render('error');
});

module.exports = app;
