var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json())

var assignments = {};

app.post("/state.json", function(req, res) {
  assignments = req.body
  res.end("OK")
});

app.get("/state.json", function(req, res) {
  res.end(JSON.stringify(assignments))
});

module.exports = app;
