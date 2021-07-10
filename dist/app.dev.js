"use strict";

var express = require('express');

var router = require('./routers.js'); //init app


var app = express();
var port = 8000; //set up views --> 

app.set('view engine', 'pug'); //serve static assets --> 

app.use(express["static"]('./public'));
app.get('/', function (req, res) {
  res.render('index');
});
app.get('/signup', function (req, res) {
  res.render('signup');
});
app.use('/form', router);
app.use('/user', router); //start server -> 

app.listen(port, function () {
  console.log("server is up on port number 8000"); //server started! 
});