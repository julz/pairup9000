var path = require('path');
var express = require('express');
var app = require('./app');
var http = require('http').Server(app);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/edit', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/static/bundle.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'bundle.js'));
});

app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;
